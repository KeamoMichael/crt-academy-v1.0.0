-- Add profile_icon column to user_profile table
ALTER TABLE public.user_profile 
ADD COLUMN IF NOT EXISTS profile_icon text;

-- The profile_icon will store the URL/path to the uploaded image in Supabase Storage
-- Users can upload custom profile images which will be stored in a 'profile-icons' bucket

