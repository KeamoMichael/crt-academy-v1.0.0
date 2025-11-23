import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { signOut } from "../auth/logout";
import { supabase } from "../lib/supabaseClient";
import { Book, Activity, Terminal, Zap, Play } from "lucide-react";
import { CURRICULUM } from "../../services/curriculum";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [profileIcon, setProfileIcon] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [userProgress, setUserProgress] = useState({
        symbol: 'XAUUSD',
        level: 0,
        completedLessons: [],
        examsPassed: [],
        xp: 0,
        streak: 0,
        hearts: 5,
        maxHearts: 5,
        placementTaken: false
    });

    useEffect(() => {
        if (user) {
            // Fetch user profile
            supabase
                .from('user_profile')
                .select('username, profile_icon, symbol_locked')
                .eq('user_id', user.id)
                .single()
                .then(({ data, error }) => {
                    if (!error && data) {
                        setUsername(data.username);
                        setProfileIcon(data.profile_icon);
                        if (data.symbol_locked) {
                            setUserProgress(prev => ({ ...prev, symbol: data.symbol_locked }));
                        }
                    }
                    setProfileLoading(false);
                });

            // Load user progress from localStorage (like the main App.tsx does)
            const saved = localStorage.getItem('crt_academy_user_v2');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.symbol) {
                        setUserProgress(prev => ({ ...prev, ...parsed }));
                    }
                } catch (e) {
                    console.error('Error loading progress:', e);
                }
            }
        }
    }, [user]);

    if (loading || profileLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
    if (!user) return <Navigate to="/login" />;

    const currentLevel = CURRICULUM[userProgress.level];
    const isNewUser = !userProgress.placementTaken;
    
    // Calculate overall progress
    const totalLessons = 50; // Approximate - you can calculate from actual curriculum
    const progressPercent = Math.round((userProgress.completedLessons.length / totalLessons) * 100);

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header with Settings */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        {profileIcon ? (
                            <img
                                src={profileIcon}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center border-2 border-gray-300">
                                <span className="text-xl font-bold text-white">
                                    {username ? username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                Welcome back, {username || "Trader"}.
                            </h1>
                            <p className="text-slate-500 mt-1">
                                Symbol: <span className="font-mono font-bold text-slate-900">{userProgress.symbol}</span> • Level: <span className="font-bold text-emerald-600">{currentLevel?.title || "Placement Pending"}</span>
                            </p>
                        </div>
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
                        <button
                            onClick={() => navigate("/settings")}
                            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Settings</span>
                        </button>
                        <button 
                            onClick={signOut}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main Action Area */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Course Status - Hero Card */}
                    <div className="md:col-span-2">
                        <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-between group cursor-pointer" onClick={() => alert("Theory Vault - Coming soon!")}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/20"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase rounded-full border border-emerald-500/20">
                                        {isNewUser ? "Assessment Required" : "Current Module"}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold mb-2">
                                    {isNewUser ? "Begin Knowledge Assessment" : currentLevel?.title || "Get Started"}
                                </h2>
                                <p className="text-slate-400 max-w-md">
                                    {isNewUser 
                                        ? "We need to analyze your skill level to build your custom curriculum." 
                                        : currentLevel?.description || "Start your trading journey"
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

                    {/* Quick Stats */}
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
                        onClick={() => alert("Theory Vault - Coming soon!")}
                        className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left group"
                    >
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Book size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Theory Vault</h3>
                        <p className="text-sm text-slate-500">Access your personalized curriculum and lessons.</p>
                    </button>

                    <button 
                        onClick={() => alert("The Gym - Coming soon!")}
                        className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left group"
                    >
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Activity size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">The Gym</h3>
                        <p className="text-sm text-slate-500">Practice pattern recognition with historical data.</p>
                    </button>

                    <button 
                        onClick={() => alert("Live Terminal - Coming soon!")}
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
        </div>
    );
}
