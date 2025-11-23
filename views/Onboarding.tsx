
import React, { useState } from 'react';
import { Check, ShieldCheck, LogIn } from 'lucide-react';
import { APP_NAME } from '../constants';

const SYMBOLS = ['EURUSD', 'GBPUSD', 'XAUUSD', 'NAS100', 'US30'];

interface OnboardingProps {
  onComplete: (symbol: string) => void;
}

const Logo = () => (
  <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6">
    <path d="M16 2V30" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
    <rect x="7" y="8" width="18" height="16" rx="2" stroke="#0f172a" strokeWidth="2" fill="white" />
    <path d="M7 16H25" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const handleConfirm = () => {
      if (selected) onComplete(selected);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-white p-8 text-center border-b border-slate-100">
            <Logo />
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{APP_NAME}</h1>
            <p className="text-slate-500 text-sm font-medium">Academy Login</p>
        </div>

        <div className="p-8">
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-800">Account Setup</h2>
                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                            To enter The Foundry, you must commit to a single asset class. This will be your specialization.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {SYMBOLS.map(sym => (
                            <button
                                key={sym}
                                onClick={() => setSelected(sym)}
                                className={`p-4 rounded-xl border font-mono font-bold transition-all
                                    ${selected === sym 
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                                        : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                                    }
                                `}
                            >
                                {sym}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => setStep(2)}
                        disabled={!selected}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        Continue
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                     <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">The Contract</h2>
                        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                            I hereby commit to studying <strong>{selected}</strong> exclusively. I understand I must pass the Knowledge Assessment before accessing the full curriculum.
                        </p>
                    </div>

                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                            <Check size={16} className="text-emerald-500" />
                            <span>I understand Time &gt; Price.</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-700 font-medium mt-3">
                            <Check size={16} className="text-emerald-500" />
                            <span>I will not trade outside Killzones.</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-700 font-medium mt-3">
                            <Check size={16} className="text-emerald-500" />
                            <span>I accept the Assessment results.</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleConfirm}
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                    >
                        <LogIn size={20} />
                        Enter Application
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
