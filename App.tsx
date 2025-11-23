
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TheoryVault } from './views/TheoryVault';
import { Simulator } from './views/Simulator';
import { LiveTerminal } from './views/LiveTerminal';
import { Onboarding } from './views/Onboarding';
import { PlacementExam } from './views/PlacementExam';
import { FinalExam } from './views/FinalExam';
import { Dashboard } from './views/Dashboard';
import { View, UserProgress } from './types';
import { MAX_HEARTS, XP_PER_LESSON, XP_PER_PERFECT_LESSON } from './constants';
import { CURRICULUM } from './services/curriculum';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.ONBOARDING);
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

  useEffect(() => {
      const saved = localStorage.getItem('crt_academy_user_v2');
      if (saved) {
          const parsed = JSON.parse(saved);
          // Migration checks
          if (!parsed.examsPassed) parsed.examsPassed = [];
          if (parsed.placementTaken === undefined) parsed.placementTaken = true; // Legacy users assumed taken
          setUserProgress(parsed);
          
          // If returning user, go to Dashboard
          if (parsed.symbol) {
              setCurrentView(View.DASHBOARD);
          }
      }
  }, []);

  const saveProgress = (progress: UserProgress) => {
      setUserProgress(progress);
      localStorage.setItem('crt_academy_user_v2', JSON.stringify(progress));
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
      case View.ONBOARDING:
          return <Onboarding onComplete={handleOnboardingComplete} />;
      case View.PLACEMENT:
          return <PlacementExam onComplete={handlePlacementComplete} />;
      case View.DASHBOARD:
          return <Dashboard userProgress={userProgress} onNavigate={handleNavigate} />;
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

  if (currentView === View.ONBOARDING || currentView === View.PLACEMENT || currentView === View.FINAL_EXAM) {
      return renderView();
  }

  return (
    <Layout 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        stats={{ hearts: userProgress.hearts, xp: userProgress.xp, streak: userProgress.streak }}
    >
        {renderView()}
    </Layout>
  );
};

export default App;
