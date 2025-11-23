import { supabase } from '../lib/supabaseClient';

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}
