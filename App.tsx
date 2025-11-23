
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TheoryVault } from './views/TheoryVault';
import { Simulator } from './views/Simulator';
import { LiveTerminal } from './views/LiveTerminal';
import { Onboarding } from './views/Onboarding';
import { PlacementExam } from './views/PlacementExam';
import { FinalExam } from './views/FinalExam';
import { Dashboard } from './views/Dashboard';
import { Settings } from './views/Settings';
import { View, UserProgress } from './types';
import { MAX_HEARTS, XP_PER_LESSON, XP_PER_PERFECT_LESSON } from './constants';
import { CURRICULUM } from './services/curriculum';
import { useAuth } from './src/auth/useAuth';
import { Login } from './views/Login';
import { Signup } from './views/Signup';
import { supabase } from './src/lib/supabaseClient';

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  
  const [userProgress, setUserProgress] = useState<UserProgress>({
      symbol: '',
      level: 0,
      completedLessons: [],
      examsPassed: [],
      xp: 0,
      streak: 0,
      hearts: MAX_HEARTS,
      maxHearts: MAX_HEARTS,
      placementTaken: false
  });

  // Check authentication and load user progress
  useEffect(() => {
      if (authLoading) return;

      if (!user) {
          // Not authenticated - show login
          setCurrentView(View.LOGIN);
          return;
      }

      // User is authenticated - load their progress
      loadUserProgress();
  }, [user, authLoading]);

  const loadUserProgress = async () => {
      if (!user) return;

      try {
          // First, try to load from Supabase (user-specific)
          const { data: profileData } = await supabase
              .from('user_profile')
              .select('symbol_locked')
              .eq('user_id', user.id)
              .single();

          // Load from localStorage (for backward compatibility and local state)
          const saved = localStorage.getItem(`crt_academy_user_v2_${user.id}`);
          if (saved) {
              const parsed = JSON.parse(saved);
              if (!parsed.examsPassed) parsed.examsPassed = [];
              if (parsed.placementTaken === undefined) parsed.placementTaken = true;
              
              // Use symbol from profile if available
              if (profileData?.symbol_locked) {
                  parsed.symbol = profileData.symbol_locked;
              }
              
              setUserProgress(parsed);
              
              // If returning user, go to Dashboard
              if (parsed.symbol) {
                  setCurrentView(View.DASHBOARD);
              } else {
                  setCurrentView(View.ONBOARDING);
              }
          } else {
              // New user or no saved progress
              if (profileData?.symbol_locked) {
                  setUserProgress(prev => ({ ...prev, symbol: profileData.symbol_locked }));
                  setCurrentView(View.DASHBOARD);
              } else {
                  setCurrentView(View.ONBOARDING);
              }
          }
      } catch (error) {
          console.error('Error loading user progress:', error);
          // Fallback to localStorage without user ID
          const saved = localStorage.getItem('crt_academy_user_v2');
          if (saved) {
              const parsed = JSON.parse(saved);
              setUserProgress(parsed);
              if (parsed.symbol) {
                  setCurrentView(View.DASHBOARD);
              }
          }
      }
  };

  const saveProgress = (progress: UserProgress) => {
      setUserProgress(progress);
      
      // Save to localStorage with user ID for user-specific storage
      if (user) {
          localStorage.setItem(`crt_academy_user_v2_${user.id}`, JSON.stringify(progress));
      } else {
          // Fallback for non-authenticated users
          localStorage.setItem('crt_academy_user_v2', JSON.stringify(progress));
      }

      // Optionally sync to Supabase (you can create a user_progress table if needed)
      // For now, we'll just update the symbol in user_profile
      if (user && progress.symbol) {
          supabase
              .from('user_profile')
              .update({ symbol_locked: progress.symbol })
              .eq('user_id', user.id)
              .then(({ error }) => {
                  if (error) console.error('Error syncing progress:', error);
              });
      }
  };

  const handleNavigate = (view: View) => {
      // INTERCEPTION LOGIC:
      // If user tries to access the Vault (Course) and hasn't taken placement, force placement.
      if (view === View.VAULT && !userProgress.placementTaken) {
          setCurrentView(View.PLACEMENT);
      } else {
          setCurrentView(view);
      }
  };

  const handleOnboardingComplete = (symbol: string) => {
      const newProgress = { ...userProgress, symbol };
      saveProgress(newProgress);
      // New flow: Go to Dashboard first
      setCurrentView(View.DASHBOARD);
  };

  const handlePlacementComplete = (levelIndex: number) => {
      // levelIndex: 0 = L1, 1 = L2, 2 = L3
      // AUTO-COMPLETE LOGIC:
      // We must backfill lessons and exams for levels below the placed level.
      
      const newCompletedLessons = new Set(userProgress.completedLessons);
      const newExamsPassed = new Set(userProgress.examsPassed);
      let xpBonus = 0;

      // If starting at L2 (index 1) or higher, complete L1
      if (levelIndex >= 1) {
         const l1 = CURRICULUM[0];
         l1.modules.forEach(m => m.lessons.forEach(l => newCompletedLessons.add(l.id)));
         if (l1.exam) newExamsPassed.add(l1.exam.id);
         xpBonus += 500; // Bonus for skipping
      }

      // If starting at L3 (index 2) or higher, complete L1 and L2
      if (levelIndex >= 2) {
         const l2 = CURRICULUM[1];
         l2.modules.forEach(m => m.lessons.forEach(l => newCompletedLessons.add(l.id)));
         if (l2.exam) newExamsPassed.add(l2.exam.id);
         xpBonus += 500;
      }

      const newProgress = { 
          ...userProgress, 
          level: levelIndex,
          completedLessons: Array.from(newCompletedLessons),
          examsPassed: Array.from(newExamsPassed),
          placementTaken: true,
          xp: userProgress.xp + xpBonus
      };

      saveProgress(newProgress);
      setCurrentView(View.VAULT);
  };

  const handleLessonComplete = (lessonId: string, score: number) => {
      let xpGain = 0;
      if (!userProgress.completedLessons.includes(lessonId)) {
          xpGain = XP_PER_LESSON;
      }
      if (score === 100 && !userProgress.completedLessons.includes(lessonId)) {
          xpGain += (XP_PER_PERFECT_LESSON - XP_PER_LESSON);
      }

      const newProgress = {
          ...userProgress,
          completedLessons: Array.from(new Set([...userProgress.completedLessons, lessonId])),
          xp: userProgress.xp + xpGain,
          streak: userProgress.streak + 1 
      };
      saveProgress(newProgress);
  };

  const handleExamComplete = (examId: string) => {
      const XP_EXAM_BONUS = 100;
      const newProgress = {
          ...userProgress,
          examsPassed: Array.from(new Set([...(userProgress.examsPassed || []), examId])),
          xp: userProgress.xp + XP_EXAM_BONUS
      };
      saveProgress(newProgress);
      setCurrentView(View.VAULT);
  };

  const handleFinalExamPass = () => {
      handleExamComplete("exam-l5"); 
  };

  const handleFinalExamFail = () => {
      handleHeartLoss();
      setCurrentView(View.VAULT);
      alert("Simulation Failed. Study the feedback and try again.");
  };

  const handleExamFail = (levelId: string) => {
      const level = CURRICULUM.find(l => l.id === levelId);
      if (level) {
          const lessonIds = level.modules.flatMap(m => m.lessons.map(l => l.id));
          const newCompleted = userProgress.completedLessons.filter(id => !lessonIds.includes(id));
          
          const newProgress = {
              ...userProgress,
              completedLessons: newCompleted
          };
          saveProgress(newProgress);
          alert("Exam Failed. Level progress has been reset. You must review the material.");
      }
  };

  const handleHeartLoss = () => {
      if (userProgress.hearts > 0) {
          const newHearts = userProgress.hearts - 1;
          const newProgress = { ...userProgress, hearts: newHearts };
          saveProgress(newProgress);
          
          if (newHearts === 0) {
              setShowRecoveryModal(true);
          }
      }
  };

  const handleHeartRestored = () => {
      const newProgress = { ...userProgress, hearts: userProgress.hearts + 1 };
      saveProgress(newProgress);
      setShowRecoveryModal(false);
      setCurrentView(View.VAULT); 
  };

  const renderView = () => {
    switch (currentView) {
      case View.LOGIN:
          return <Login onNavigate={handleNavigate} />;
      case View.SIGNUP:
          return <Signup onNavigate={handleNavigate} />;
      case View.ONBOARDING:
          return <Onboarding onComplete={handleOnboardingComplete} />;
      case View.PLACEMENT:
          return <PlacementExam onComplete={handlePlacementComplete} />;
      case View.DASHBOARD:
          return <Dashboard userProgress={userProgress} onNavigate={handleNavigate} />;
      case View.SETTINGS:
          return <Settings onNavigate={handleNavigate} />;
      case View.VAULT:
        return <TheoryVault 
                  completedLessons={userProgress.completedLessons} 
                  examsPassed={userProgress.examsPassed}
                  onLessonComplete={handleLessonComplete}
                  onExamComplete={handleExamComplete}
                  onExamFail={handleExamFail}
                  onHeartLoss={handleHeartLoss}
                  hearts={userProgress.hearts}
                  userLevel={userProgress.level}
                  userXP={userProgress.xp}
                  startFinalExam={() => setCurrentView(View.FINAL_EXAM)}
               />;
      case View.SIMULATOR:
        return <Simulator restoreHeartMode={userProgress.hearts < MAX_HEARTS} onHeartRestored={handleHeartRestored} />;
      case View.TERMINAL:
        return <LiveTerminal />;
      case View.FINAL_EXAM:
        return <FinalExam onPass={handleFinalExamPass} onFail={handleFinalExamFail} />;
      default:
        return <Dashboard userProgress={userProgress} onNavigate={handleNavigate} />;
    }
  };

  // Show login/signup without layout
  if (currentView === View.LOGIN || currentView === View.SIGNUP) {
      return renderView();
  }

  // Show onboarding, placement, and final exam without layout
  if (currentView === View.ONBOARDING || currentView === View.PLACEMENT || currentView === View.FINAL_EXAM) {
      return renderView();
  }

  // Show authenticated views with layout
  if (authLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
      );
  }

  return (
    <Layout 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        stats={{ hearts: userProgress.hearts, xp: userProgress.xp, streak: userProgress.streak }}
        user={user}
    >
        {renderView()}
    </Layout>
  );
};

export default App;
