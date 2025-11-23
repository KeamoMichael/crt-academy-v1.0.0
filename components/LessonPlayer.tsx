
import React, { useState, useEffect } from 'react';
import { Lesson, QuizQuestion } from '../types';
import { CheckCircle, XCircle, ArrowRight, HeartCrack, Trophy, AlertTriangle, CheckSquare, Circle, Film, Target } from 'lucide-react';
import { getClipsForLesson, ClipMetadata } from '../services/curriculumClips';
import { BarReplay } from './charts/BarReplay';
import { RangeDrill } from './interactive/RangeDrill';
import { ModelIDDrill } from './interactive/ModelIDDrill';
import { generateCurriculumPattern, generateSeededCandles } from '../services/candleDataGenerator';
import { Candle, Timeframe } from '../types';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete: (score: number) => void;
  onHeartLoss: () => void;
  hearts: number;
  renderInteractive?: (type: string) => React.ReactNode;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, onComplete, onHeartLoss, hearts, renderInteractive }) => {
  const [phase, setPhase] = useState<'CONTENT' | 'QUIZ' | 'REPORT'>('CONTENT');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [clips, setClips] = useState<ClipMetadata[]>([]);
  const [clipCandles, setClipCandles] = useState<Record<string, Candle[]>>({});
  
  useEffect(() => {
      const qList = lesson.questions || (lesson.quiz ? [lesson.quiz] : []);
      setQuestions(qList);
      if (!lesson.content && qList.length > 0) {
          setPhase('QUIZ');
      }
      
      // Load clips for this lesson
      const lessonClips = getClipsForLesson(lesson.id);
      setClips(lessonClips);
      
      // Generate candle data for each clip
      const candlesMap: Record<string, Candle[]> = {};
      lessonClips.forEach(clip => {
          if (clip.replaySeed) {
              candlesMap[clip.id] = generateSeededCandles(
                  30, 
                  clip.timeframe as Timeframe, 
                  clip.replaySeed
              );
          } else {
              // Determine pattern from clip description or use default
              let pattern: 'model-1' | 'turtle-soup' | 'crt-ote' | 'three-candles' | 'ranging' = 'ranging';
              if (clip.description.toLowerCase().includes('model')) pattern = 'model-1';
              else if (clip.description.toLowerCase().includes('turtle')) pattern = 'turtle-soup';
              else if (clip.description.toLowerCase().includes('three')) pattern = 'three-candles';
              else if (clip.description.toLowerCase().includes('ote')) pattern = 'crt-ote';
              
              candlesMap[clip.id] = generateCurriculumPattern(
                  pattern,
                  clip.timeframe as Timeframe
              );
          }
      });
      setClipCandles(candlesMap);
  }, [lesson]);

  // Proceed to next question or report
  const handleProceed = () => {
      if (phase === 'CONTENT') {
          if (questions.length > 0) {
              setPhase('QUIZ');
          } else {
              onComplete(100); // No quiz, just content
          }
          return;
      }

      if (phase === 'QUIZ') {
          if (selectedOption === null) return;
          
          // Save answer
          setAnswers(prev => ({...prev, [currentQuestionIndex]: selectedOption}));
          setSelectedOption(null);

          // Move to next or Finish
          if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex(prev => prev + 1);
          } else {
              setPhase('REPORT');
          }
      }
  };

  // Calculate results
  const calculateResult = () => {
      let correctCount = 0;
      const results = questions.map((q, idx) => {
          const isCorrect = answers[idx] === q.correctIndex;
          if (isCorrect) correctCount++;
          return { question: q, isCorrect, userAnswer: answers[idx] };
      });
      
      const score = Math.round((correctCount / questions.length) * 100);
      return { score, results, correctCount };
  };

  const resultData = phase === 'REPORT' ? calculateResult() : null;

  // Effect to handle penalty ONLY once when reaching report
  useEffect(() => {
      if (phase === 'REPORT' && resultData) {
          // If score is not 100%, it is considered a failure in "Mastery" mode logic
          // But we can be lenient for basic lessons.
          // Sticking to strict: Any wrong answer = Penalty.
          if (resultData.score < 100) {
              onHeartLoss();
          }
      }
  }, [phase]);

  // --- VIEW: OUT OF HEARTS ---
  if (hearts <= 0 && phase !== 'REPORT') {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in zoom-in duration-300">
              <HeartCrack size={64} className="text-rose-400 mb-4" />
              <h2 className="text-2xl font-bold text-slate-900">Out of Hearts!</h2>
              <p className="text-slate-500 max-w-md mt-2 mb-6">
                  The market punishes mistakes. You need to clear your head and practice before learning new theory.
              </p>
              <div className="p-4 bg-slate-100 rounded-lg border border-slate-200 text-sm text-slate-600 mb-6">
                  Go to <strong>The Gym (Simulator)</strong> and make a profitable trade to restore a Heart.
              </div>
          </div>
      );
  }

  // --- VIEW: REPORT ---
  if (phase === 'REPORT' && resultData) {
      const isPerfect = resultData.score === 100;
      
      return (
          <div className="max-w-2xl mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-24">
               <div className="text-center">
                    <div className="mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Session Judgment</span>
                    </div>
                    
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl mx-auto mb-6 ${isPerfect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {isPerfect ? <Trophy size={48} /> : <XCircle size={48} />}
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        {isPerfect ? "Concept Mastered" : "Discipline Check Failed"}
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Score: {resultData.score}%
                    </p>
               </div>

               <div className="space-y-4">
                   {resultData.results.map((res, idx) => (
                       <div key={idx} className={`bg-white p-6 rounded-xl border shadow-sm ${res.isCorrect ? 'border-emerald-100' : 'border-rose-100'}`}>
                           <div className="flex items-start gap-3 mb-4">
                               {res.isCorrect ? <CheckCircle className="text-emerald-500 shrink-0 mt-1" /> : <AlertTriangle className="text-rose-500 shrink-0 mt-1" />}
                               <div>
                                   <h4 className="font-bold text-slate-900">{res.question.question}</h4>
                                   {!res.isCorrect && (
                                       <div className="mt-2 text-xs font-mono text-rose-600 bg-rose-50 px-2 py-1 rounded inline-block">
                                           You chose: {res.question.options[res.userAnswer]}
                                       </div>
                                   )}
                               </div>
                           </div>
                           
                           <div className="pl-9 text-slate-600 text-sm leading-relaxed border-l-2 border-slate-100 ml-2">
                               <span className="font-bold text-slate-400 text-xs uppercase block mb-1">Analysis</span>
                               {res.question.explanation}
                           </div>
                       </div>
                   ))}
               </div>

               <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex justify-center z-10 md:pl-64">
                    <button 
                        onClick={() => onComplete(resultData.score)}
                        className="px-12 py-4 bg-slate-900 hover:bg-slate-800 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2"
                    >
                        {isPerfect ? "Continue Journey" : "Acknowledge & Return"} <ArrowRight size={20} />
                    </button>
               </div>
               {!isPerfect && (
                  <div className="text-center text-rose-500 text-sm font-bold flex items-center justify-center gap-1 mt-4">
                      <HeartCrack size={14} /> -1 Heart Penalty Applied
                  </div>
              )}
          </div>
      );
  }

  // --- VIEW: QUIZ (Question Input) ---
  if (phase === 'QUIZ') {
      const question = questions[currentQuestionIndex];
      return (
          <div className="max-w-3xl mx-auto py-8 space-y-8 animate-in fade-in duration-500 pb-24">
              <div className="flex items-center justify-between text-sm font-bold text-slate-400 uppercase tracking-wider">
                  <span>Assessment Phase</span>
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}></div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                  {question.question}
              </h3>

              <div className="grid gap-4">
                  {question.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      return (
                        <button
                            key={idx}
                            onClick={() => setSelectedOption(idx)}
                            className={`p-6 rounded-xl border-2 text-left transition-all flex justify-between items-center group
                                ${isSelected 
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm transform scale-[1.01]' 
                                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                                }
                            `}
                        >
                            <span className="font-medium text-lg">{opt}</span>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                ${isSelected ? 'border-emerald-500' : 'border-slate-300'}
                            `}>
                                {isSelected && <div className="w-3 h-3 bg-emerald-500 rounded-full" />}
                            </div>
                        </button>
                      );
                  })}
              </div>

              <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white border-t border-slate-200 flex justify-between items-center z-10">
                <div className="text-sm text-slate-400 hidden md:block font-medium">
                    Select carefully. Judgement is final.
                </div>
                <button 
                    onClick={handleProceed}
                    disabled={selectedOption === null}
                    className="w-full md:w-auto px-12 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                >
                    <CheckSquare size={20} /> {currentQuestionIndex === questions.length - 1 ? "Submit Assessment" : "Next Question"}
                </button>
              </div>
          </div>
      );
  }

  // --- VIEW: CONTENT (Learning Phase) ---
  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      <div className="prose prose-slate prose-lg max-w-none">
        <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">{lesson.title}</h2>
        <div className="text-lg text-slate-600 whitespace-pre-line border-l-4 border-emerald-500 pl-6 py-2 bg-slate-50/50 rounded-r-lg">
            {lesson.content}
        </div>
      </div>

      {/* Curriculum Clips - Demo Clips First */}
      {clips.filter(c => c.clipPurpose === 'demo').map((clip) => {
          const candles = clipCandles[clip.id] || [];
          if (candles.length === 0) return null;
          
          return (
              <div key={clip.id} className="my-8 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                  <div className="p-4 bg-blue-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <Film className="text-blue-600" size={20} />
                          <div>
                              <div className="text-sm font-bold text-slate-900">Demo: {clip.description}</div>
                              <div className="text-xs text-slate-500">Source: {clip.sourcePageOrSlide}</div>
                          </div>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">DEMO</span>
                  </div>
                  <div className="p-6">
                      <BarReplay
                          candles={candles}
                          timeframe={clip.timeframe as Timeframe}
                          speed={2}
                          allowRewind={clip.interactionPolicy?.allowRewind ?? true}
                      />
                  </div>
              </div>
          );
      })}

      {/* Practice Clips */}
      {clips.filter(c => c.clipPurpose === 'practice').map((clip) => {
          const candles = clipCandles[clip.id] || [];
          if (candles.length === 0) return null;
          
          return (
              <div key={clip.id} className="my-8 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                  <div className="p-4 bg-emerald-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <Target className="text-emerald-600" size={20} />
                          <div>
                              <div className="text-sm font-bold text-slate-900">Practice: {clip.description}</div>
                              <div className="text-xs text-slate-500">Source: {clip.sourcePageOrSlide}</div>
                          </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">PRACTICE</span>
                  </div>
                  <div className="p-6">
                      {clip.description.toLowerCase().includes('range') && (
                          <RangeDrill
                              onComplete={(score) => {
                                  if (score === 100) {
                                      // Award XP or handle success
                                  }
                              }}
                              onHeartLoss={onHeartLoss}
                              timeframe={clip.timeframe as Timeframe}
                          />
                      )}
                      {clip.description.toLowerCase().includes('model') && (
                          <ModelIDDrill
                              onComplete={(score) => {
                                  if (score === 100) {
                                      // Award XP or handle success
                                  }
                              }}
                              onHeartLoss={onHeartLoss}
                              timeframe={clip.timeframe as Timeframe}
                              clipSeed={clip.replaySeed}
                          />
                      )}
                  </div>
              </div>
          );
      })}

      {/* Legacy Interactive Module (if componentId exists) */}
      {lesson.componentId && renderInteractive && (
        <div className="my-8 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
           <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest flex justify-between items-center">
              <span>Interactive Module</span>
              <span className="text-emerald-600 flex items-center gap-1"><Circle size={8} fill="currentColor" /> Live</span>
           </div>
           <div className="p-8">
               {renderInteractive(lesson.componentId)}
           </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white border-t border-slate-200 flex justify-end items-center z-10">
        <button 
            onClick={handleProceed}
            className="w-full md:w-auto px-12 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2"
        >
            {questions.length > 0 ? "Take Assessment" : "Complete Lesson"} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
