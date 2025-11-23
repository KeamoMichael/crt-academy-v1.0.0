import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { signOut } from "../auth/logout";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [profileIcon, setProfileIcon] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // Fetch user profile to get username and profile icon
            supabase
                .from('user_profile')
                .select('username, profile_icon')
                .eq('user_id', user.id)
                .single()
                .then(({ data, error }) => {
                    if (!error && data) {
                        setUsername(data.username);
                        setProfileIcon(data.profile_icon);
                    }
                    setProfileLoading(false);
                });
        }
    }, [user]);

    if (loading || profileLoading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/login" />;

    return (
        <div style={{ padding: 20 }}>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Welcome to CRT Academy</h1>
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
            </div>

            <div className="flex items-center space-x-4 mb-6">
                {profileIcon ? (
                    <img
                        src={profileIcon}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center border-2 border-gray-300">
                        <span className="text-2xl font-bold text-white">
                            {username ? username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
                <div>
                    {username ? (
                        <p className="text-xl">Welcome back, <strong>{username}</strong>!</p>
                    ) : (
                        <p className="text-xl">You are logged in as: {user.email}</p>
                    )}
                </div>
            </div>

            <button 
                onClick={signOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
                Logout
            </button>
        </div>
    );
}
