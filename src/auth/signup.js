import { supabase } from '../lib/supabaseClient';

export async function signUp(email, password, username, symbolLocked) {
    // 1. Create authentication user
    // The emailRedirectTo option allows users to be redirected to your app after confirming email
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

    const userId = authData.user.id;

    // 2. Create profile entry in user_profile
    const { error: profileError } = await supabase
        .from('user_profile')
        .insert({
            user_id: userId,
            username,
            symbol_locked: symbolLocked
        });

    if (profileError) {
        console.error(profileError);
        throw profileError;
    }

    // 3. Initialize tool unlocks
    await supabase.from('user_tool_unlocks').insert({
        user_id: userId
    });

    // 4. Initialize gamification defaults
    await supabase.from('user_gamification').insert({
        user_id: userId
    });

    return authData;
}
