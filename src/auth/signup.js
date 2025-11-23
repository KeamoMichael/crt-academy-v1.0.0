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
        console.error('Signup error:', authError);
        
        // Check if it's an email sending error
        if (authError.message && (
            authError.message.includes('email') && 
            authError.message.includes('send')
        )) {
            // If user was created but email failed, still allow signup
            // The user account exists, they just need to verify email later
            if (authData?.user) {
                console.warn('User created but email confirmation failed. User can still sign in if email confirmation is disabled.');
                // Return the data anyway - user account was created
                return authData;
            }
            // If user creation also failed, throw a more helpful error
            throw new Error('Failed to create account. Please check your email address and try again. If the problem persists, email confirmation may not be configured.');
        }
        
        throw authError;
    }

    // Note: The user profile, tool unlocks, and gamification are now automatically created
    // by a database trigger (handle_new_user) when a new user is created in auth.users
    // This avoids RLS policy issues during signup
    
    return authData;
}
