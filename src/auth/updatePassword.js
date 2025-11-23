import { supabase } from '../lib/supabaseClient';

export async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

