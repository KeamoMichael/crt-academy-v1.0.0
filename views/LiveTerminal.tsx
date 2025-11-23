import React, { useState } from 'react';
import { KillzoneClock } from '../components/KillzoneClock';
import { PotHealthMeter } from '../components/PotHealthMeter';
import { Card } from '../components/ui/Card';
import { WEEKLY_PROFILES, INITIAL_BALANCE } from '../constants';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

export const LiveTerminal: React.FC = () => {
  const [balance] = useState(INITIAL_BALANCE);
  const [dailyLoss] = useState(120); // Mock value
  const today = new Date().getDay(); // 0=Sun, 1=Mon...
  const profile = WEEKLY_PROFILES[Math.max(0, Math.min(4, today - 1))] || WEEKLY_PROFILES[0];

  const [checklist, setChecklist] = useState({
    time: false,
    range: false,
    pot: false
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isReady = Object.values(checklist).every(Boolean);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
             <KillzoneClock />
        </div>
        <Card className="bg-slate-50">
            <PotHealthMeter balance={balance} dailyLoss={dailyLoss} />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Profile */}
        <Card title="Weekly Profile Tracker">
            <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-slate-500">Today is</span>
                    <span className="text-xl font-bold text-slate-900">{profile.day}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xs text-blue-600 font-bold uppercase mb-1">Bias</div>
                        <div className="text-blue-900 font-medium">{profile.bias}</div>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                        <div className="text-xs text-indigo-600 font-bold uppercase mb-1">Focus</div>
                        <div className="text-indigo-900 font-medium text-sm">{profile.focus}</div>
                    </div>
                </div>

                <div className="bg-slate-100 p-4 rounded-lg mt-4">
                    <p className="text-slate-600 text-sm italic">
                        "If it is {profile.day}, I am looking for {profile.bias === 'Bullish' ? 'Lower Prices first to buy' : 'Higher Prices first to sell'}."
                    </p>
                </div>
            </div>
        </Card>

        {/* Pre-Trade Checklist */}
        <Card title="The Guard (Pre-Flight)" className={isReady ? "ring-2 ring-emerald-400" : ""}>
            <div className="space-y-4">
                <p className="text-slate-500 text-sm">You cannot execute until all checks are cleared.</p>
                
                <button 
                    onClick={() => toggleCheck('time')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                >
                    {checklist.time ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-300 group-hover:text-slate-400" />}
                    <span className={checklist.time ? "text-slate-900 line-through decoration-slate-300" : "text-slate-700"}>Is Time Valid? (Killzone Active)</span>
                </button>

                <button 
                    onClick={() => toggleCheck('range')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                >
                    {checklist.range ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-300 group-hover:text-slate-400" />}
                    <span className={checklist.range ? "text-slate-900 line-through decoration-slate-300" : "text-slate-700"}>Has the Liquidity been taken?</span>
                </button>

                <button 
                    onClick={() => toggleCheck('pot')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                >
                    {checklist.pot ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-300 group-hover:text-slate-400" />}
                    <span className={checklist.pot ? "text-slate-900 line-through decoration-slate-300" : "text-slate-700"}>Is Risk calculated? (Stop Loss in place)</span>
                </button>

                <div className="pt-4 border-t border-slate-100">
                    <button 
                        disabled={!isReady}
                        className={`w-full py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-all ${isReady ? 'bg-slate-900 text-white shadow-lg hover:bg-slate-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                        {!isReady && <Lock size={16} />}
                        {isReady ? "UNLOCK TERMINAL" : "LOCKED"}
                    </button>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};