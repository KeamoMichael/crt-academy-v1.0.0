
import React, { useState } from 'react';
import { PLACEMENT_QUESTIONS, calculatePlacementLevel } from '../services/placement';
import { ArrowRight, Check, BookOpen } from 'lucide-react';

interface PlacementExamProps {
  onComplete: (level: number) => void;
}

export const PlacementExam: React.FC<PlacementExamProps> = ({ onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);

  const currentQ = PLACEMENT_QUESTIONS[currentQIndex];
  const isLast = currentQIndex === PLACEMENT_QUESTIONS.length - 1;

  const handleNext = () => {
    if (selected === null) return;

    const newAnswers = { ...answers, [currentQ.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (isLast) {
      const level = calculatePlacementLevel(newAnswers);
      onComplete(level);
    } else {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-white border-b border-slate-100 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <BookOpen size={20} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-900">Knowledge Assessment</h1>
                    <p className="text-slate-500 text-xs font-medium">Adaptive difficulty calibration</p>
                </div>
            </div>
            <div className="text-slate-400 font-mono font-medium text-sm bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                {currentQIndex + 1} / {PLACEMENT_QUESTIONS.length}
            </div>
        </div>

        <div className="p-8">
            <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
                <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQIndex) / PLACEMENT_QUESTIONS.length) * 100}%` }}
                ></div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-snug">{currentQ.question}</h2>

            <div className="space-y-3 mb-8">
                {currentQ.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelected(idx)}
                        className={`w-full p-5 text-left rounded-xl border transition-all flex items-center justify-between group
                            ${selected === idx 
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' 
                                : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                            }
                        `}
                    >
                        <span className="font-medium text-lg">{opt}</span>
                        {selected === idx && <div className="bg-emerald-500 text-white p-1 rounded-full"><Check size={14} /></div>}
                    </button>
                ))}
            </div>

            <button 
                onClick={handleNext}
                disabled={selected === null}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2"
            >
                {isLast ? "Finish Assessment" : "Next Question"} <ArrowRight size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};
