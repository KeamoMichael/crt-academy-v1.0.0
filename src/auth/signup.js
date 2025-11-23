import { supabase } from '../lib/supabaseClient';

export async function signUp(email, password, username, symbolLocked) {
    // 1. Create authentication user
    // The emailRedirectTo option allows users to be redirected to your app after confirming email
    // The username and symbol_locked are stored in user metadata, which will be used by the database trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
                username: username,
                symbol_locked: symbolLocked
            }
        }
    });

    if (authError) {
        console.error(authError);
        throw authError;
    }

    // Note: The user profile, tool unlocks, and gamification are now automatically created
    // by a database trigger (handle_new_user) when a new user is created in auth.users
    // This avoids RLS policy issues during signup
    
    return authData;
}
