import React from 'react';
import { Shield, TrendingDown, TrendingUp } from 'lucide-react';
import { INITIAL_BALANCE, MAX_DAILY_LOSS } from '../constants';

interface PotHealthMeterProps {
  balance: number;
  dailyLoss: number;
}

export const PotHealthMeter: React.FC<PotHealthMeterProps> = ({ balance, dailyLoss }) => {
  const lossPercentage = (dailyLoss / MAX_DAILY_LOSS) * 100;
  const isLocked = dailyLoss >= MAX_DAILY_LOSS;
  
  return (
    <div className="space-y-3">
        <div className="flex justify-between items-end">
            <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pot Health</h4>
                <div className="text-xl font-bold text-slate-800 font-mono">${balance.toFixed(2)}</div>
            </div>
            <div className={`text-sm font-medium flex items-center gap-1 ${dailyLoss > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {dailyLoss > 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                {dailyLoss > 0 ? `-$${dailyLoss.toFixed(2)}` : 'Safe'}
            </div>
        </div>

        <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-semibold inline-block text-slate-600">
                    Daily Drawdown Limit
                </span>
                <span className="text-xs font-semibold inline-block text-slate-600">
                    {Math.min(lossPercentage, 100).toFixed(0)}%
                </span>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-200">
                <div 
                    style={{ width: `${lossPercentage}%` }} 
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${isLocked ? 'bg-slate-800' : lossPercentage > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                ></div>
            </div>
        </div>

        {isLocked && (
             <div className="bg-slate-900 text-white text-xs p-3 rounded flex items-center gap-2 animate-pulse">
                 <Shield size={14} />
                 <span>COOL-DOWN LOCK ACTIVE. Come back tomorrow.</span>
             </div>
        )}
    </div>
  );
};