
import React from 'react';
import { Card } from '../components/ui/Card';
import { View, UserProgress } from '../types';
import { Book, Activity, Terminal, Shield, Trophy, ArrowRight, Zap, Play } from 'lucide-react';
import { CURRICULUM } from '../services/curriculum';

interface DashboardProps {
    userProgress: UserProgress;
    onNavigate: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userProgress, onNavigate }) => {
    const currentLevel = CURRICULUM[userProgress.level];
    const isNewUser = !userProgress.placementTaken;
    
    // Calculate overall progress
    const totalLessons = CURRICULUM.reduce((acc, lvl) => acc + lvl.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0), 0);
    const progressPercent = Math.round((userProgress.completedLessons.length / totalLessons) * 100);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Welcome back, Trader.
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Symbol: <span className="font-mono font-bold text-slate-900">{userProgress.symbol}</span> • Level: <span className="font-bold text-emerald-600">{currentLevel?.title || "Placement Pending"}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Streak</div>
                            <div className="font-bold text-slate-900">{userProgress.streak} Days</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Action Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Course Status - Hero Card */}
                <div className="md:col-span-2">
                    <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-between group cursor-pointer" onClick={() => onNavigate(View.VAULT)}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/20"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase rounded-full border border-emerald-500/20">
                                    {isNewUser ? "Assessment Required" : "Current Module"}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">
                                {isNewUser ? "Begin Knowledge Assessment" : currentLevel.title}
                            </h2>
                            <p className="text-slate-400 max-w-md">
                                {isNewUser 
                                    ? "We need to analyze your skill level to build your custom curriculum." 
                                    : currentLevel.description
                                }
                            </p>
                        </div>

                        <div className="relative z-10 mt-8">
                            <button className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/20">
                                {isNewUser ? <Play size={20} fill="currentColor" /> : <Book size={20} />}
                                {isNewUser ? "Start Assessment" : "Continue Learning"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats / Mini Cards */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-700">Course Progress</h3>
                            <span className="text-sm font-bold text-emerald-600">{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            {userProgress.completedLessons.length} lessons completed
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <button 
                    onClick={() => onNavigate(View.VAULT)}
                    className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left group"
                >
                     <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                         <Book size={24} />
                     </div>
                     <h3 className="font-bold text-lg text-slate-900 mb-1">Theory Vault</h3>
                     <p className="text-sm text-slate-500">Access your personalized curriculum and lessons.</p>
                 </button>

                 <button 
                    onClick={() => onNavigate(View.SIMULATOR)}
                    className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left group"
                >
                     <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                         <Activity size={24} />
                     </div>
                     <h3 className="font-bold text-lg text-slate-900 mb-1">The Gym</h3>
                     <p className="text-sm text-slate-500">Practice pattern recognition with historical data.</p>
                 </button>

                 <button 
                    onClick={() => onNavigate(View.TERMINAL)}
                    className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left group"
                >
                     <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                         <Terminal size={24} />
                     </div>
                     <h3 className="font-bold text-lg text-slate-900 mb-1">Live Terminal</h3>
                     <p className="text-sm text-slate-500">Execute your daily routine and manage risk.</p>
                 </button>
            </div>
        </div>
    );
};
