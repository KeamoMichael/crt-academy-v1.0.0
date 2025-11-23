-- Create storage bucket for profile icons
-- Run this in your Supabase SQL Editor

-- Create the bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-icons', 'profile-icons', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for profile-icons bucket
-- Allow authenticated users to upload their own profile icons
-- Files are named as: {userId}-{timestamp}.{ext}
CREATE POLICY "Users can upload their own profile icon"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-icons' AND
  (name LIKE auth.uid()::text || '-%')
);

-- Allow users to update their own profile icons
CREATE POLICY "Users can update their own profile icon"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-icons' AND
  (name LIKE auth.uid()::text || '-%')
);

-- Allow users to delete their own profile icons
CREATE POLICY "Users can delete their own profile icon"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-icons' AND
  (name LIKE auth.uid()::text || '-%')
);

-- Allow public read access to profile icons
CREATE POLICY "Public can view profile icons"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-icons');

