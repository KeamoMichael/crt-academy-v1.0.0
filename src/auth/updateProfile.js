import { supabase } from '../lib/supabaseClient';

/**
 * Update username in user_profile table
 */
export async function updateUsername(userId, newUsername) {
    const { data, error } = await supabase
        .from('user_profile')
        .update({ username: newUsername })
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

/**
 * Update profile icon URL in user_profile table
 */
export async function updateProfileIcon(userId, iconUrl) {
    const { data, error } = await supabase
        .from('user_profile')
        .update({ profile_icon: iconUrl })
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

/**
 * Upload profile icon image to Supabase Storage
 */
export async function uploadProfileIcon(userId, file) {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    // Upload the file to the profile-icons bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-icons')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        console.error(uploadError);
        throw uploadError;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
        .from('profile-icons')
        .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
    }

    // Update the profile with the new icon URL
    await updateProfileIcon(userId, urlData.publicUrl);

    return urlData.publicUrl;
}

