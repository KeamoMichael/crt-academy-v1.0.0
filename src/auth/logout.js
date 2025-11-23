import { supabase } from '../lib/supabaseClient';

export async function signOut() {
    await supabase.auth.signOut();
}
