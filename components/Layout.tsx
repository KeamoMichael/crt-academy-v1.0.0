
import React from 'react';
import { View } from '../types';
import { Book, Activity, Terminal, Heart, Zap, Trophy, LayoutDashboard } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
  stats: {
    hearts: number;
    xp: number;
    streak: number;
  };
}

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2V30" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="7" y="8" width="18" height="16" rx="2" stroke="#0f172a" strokeWidth="2.5" fill="white" />
    <path d="M7 16H25" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, stats }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.VAULT, label: 'Theory Vault', icon: Book },
    { id: View.SIMULATOR, label: 'The Gym', icon: Activity },
    { id: View.TERMINAL, label: 'Live Terminal', icon: Terminal },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex-shrink-0 flex flex-col z-20">
        <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3 font-bold text-xl text-slate-900 cursor-pointer" onClick={() => onNavigate(View.DASHBOARD)}>
                <Logo />
                <span className="tracking-tight">{APP_NAME}</span>
            </div>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium
                            ${isActive 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }
                        `}
                    >
                        <Icon size={20} className={isActive ? "text-emerald-600" : "text-slate-400"} />
                        <span>{item.label}</span>
                    </button>
                )
            })}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
             <div className="bg-white rounded-xl p-4 text-xs text-slate-500 border border-slate-200 shadow-sm">
                 <div className="flex items-center justify-between mb-2">
                    <h5 className="text-slate-800 font-bold">CRT Apprentice</h5>
                    <Trophy size={12} className="text-amber-500" />
                 </div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full mb-2 overflow-hidden">
                     <div style={{width: `${(stats.xp % 1000) / 10}%`}} className="bg-emerald-500 h-full transition-all duration-500"></div>
                 </div>
                 <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{stats.xp} XP</span>
                    <span>Next: {Math.floor(stats.xp/1000 + 1) * 1000}</span>
                 </div>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex md:hidden items-center justify-between shadow-sm z-10">
             <span className="font-bold text-slate-800 flex items-center gap-2" onClick={() => onNavigate(View.DASHBOARD)}>
                <Logo />
                {APP_NAME}
             </span>
             <div className="flex items-center gap-3 text-sm font-bold">
                <span className="flex items-center gap-1 text-rose-500"><Heart size={16} fill="currentColor" /> {stats.hearts}</span>
             </div>
        </header>

        {/* Desktop Gamification Bar */}
        <div className="hidden md:flex items-center justify-end gap-6 px-8 py-4 bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
             <div className="flex items-center gap-2 text-slate-600 font-bold text-sm" title="Daily Streak">
                <div className={`p-1.5 rounded-full ${stats.streak > 0 ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-300'}`}>
                    <Zap size={16} fill="currentColor" />
                </div>
                <span>{stats.streak}</span>
             </div>
             <div className="flex items-center gap-2 text-slate-600 font-bold text-sm" title="Total XP">
                <div className="p-1.5 rounded-full bg-blue-50 text-blue-500">
                    <Trophy size={16} />
                </div>
                <span>{stats.xp} XP</span>
             </div>
             <div className="flex items-center gap-2 text-rose-500 font-bold cursor-help text-sm" title="Lives remaining">
                <div className="p-1.5 rounded-full bg-rose-50 text-rose-500">
                    <Heart size={16} fill="currentColor" className={stats.hearts === 0 ? "animate-pulse" : ""} />
                </div>
                <span>{stats.hearts}</span>
             </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
            {children}
        </div>
      </main>
    </div>
  );
};
