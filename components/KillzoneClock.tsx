import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { KILLZONES } from '../constants';
import { Killzone } from '../types';

export const KillzoneClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [activeZone, setActiveZone] = useState<Killzone>(Killzone.NONE);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      checkKillzone(now);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const checkKillzone = (date: Date) => {
    const currentHour = date.getHours();
    
    // Simple logic for demo purposes (UTC offsets would be needed in prod)
    // Assuming user is in local time matching constants for simplicity or UTC
    let current: Killzone = Killzone.NONE;

    if (currentHour >= 2 && currentHour < 5) current = Killzone.LONDON;
    else if (currentHour >= 9 && currentHour < 12) current = Killzone.NY_AM;
    else if (currentHour >= 13 && currentHour < 16) current = Killzone.NY_PM;
    else if (currentHour >= 20 || currentHour === 0) current = Killzone.ASIA;

    setActiveZone(current);
  };

  const zoneConfig = KILLZONES[activeZone];
  const isTradingAllowed = activeZone !== Killzone.NONE && activeZone !== Killzone.ASIA;

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${isTradingAllowed ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
      <div className="bg-white p-3 rounded-full shadow-sm">
        <Clock className={`w-6 h-6 ${isTradingAllowed ? 'text-emerald-600' : 'text-slate-400'}`} />
      </div>
      <div>
        <div className="text-2xl font-mono font-bold text-slate-800">
          {format(time, 'HH:mm:ss')}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className={zoneConfig?.color || 'text-slate-500'}>
            {zoneConfig?.label || 'No Active Killzone'}
          </span>
          {!isTradingAllowed && (
             <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full flex items-center gap-1">
               <AlertTriangle size={10} /> Wait
             </span>
          )}
          {isTradingAllowed && (
             <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
               Active
             </span>
          )}
        </div>
      </div>
    </div>
  );
};