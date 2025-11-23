import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { signOut } from "../auth/logout";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const [username, setUsername] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // Fetch user profile to get username
            supabase
                .from('user_profile')
                .select('username')
                .eq('user_id', user.id)
                .single()
                .then(({ data, error }) => {
                    if (!error && data) {
                        setUsername(data.username);
                    }
                    setProfileLoading(false);
                });
        }
    }, [user]);

    if (loading || profileLoading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/login" />;

    return (
        <div style={{ padding: 20 }}>
            <h1>Welcome to CRT Academy</h1>
            {username ? (
                <p>Welcome back, <strong>{username}</strong>!</p>
            ) : (
                <p>You are logged in as: {user.email}</p>
            )}

            <button onClick={signOut}>Logout</button>
        </div>
    );
}
