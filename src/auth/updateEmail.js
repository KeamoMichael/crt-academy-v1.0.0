import { supabase } from '../lib/supabaseClient';

export async function updateEmail(newEmail) {
    const { data, error } = await supabase.auth.updateUser({
        email: newEmail
    });

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

