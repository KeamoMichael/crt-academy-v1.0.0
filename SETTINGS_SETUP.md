# Settings Feature Setup Guide

This guide will help you set up the user settings feature that allows logged-in users to:
1. Change/update email address
2. Reset/change password
3. Change and modify username
4. Change and modify profile icon with custom image uploads

## Database Setup

### Step 1: Add Profile Icon Column

Run the following SQL in your Supabase SQL Editor:

```sql
-- File: supabase_add_profile_icon.sql
ALTER TABLE public.user_profile 
ADD COLUMN IF NOT EXISTS profile_icon text;
```

### Step 2: Set Up Storage Bucket for Profile Icons

Run the following SQL in your Supabase SQL Editor to create the storage bucket and set up proper policies:

```sql
-- File: supabase_storage_setup.sql
-- This creates the 'profile-icons' bucket and sets up RLS policies
```

**Important:** After running the storage setup SQL, you may also need to:
1. Go to Supabase Dashboard → Storage
2. Verify that the `profile-icons` bucket exists
3. If it doesn't exist, create it manually:
   - Click "New bucket"
   - Name: `profile-icons`
   - Public: Yes (checked)
   - Click "Create bucket"

## Features Implemented

### 1. Email Update
- Users can change their email address
- Supabase will send a verification email to the new address
- The change requires email verification

### 2. Password Update
- Users can change their password
- Password must be at least 6 characters
- Password confirmation is required

### 3. Username Update
- Users can change their username
- Username must be unique
- Username cannot be empty

### 4. Profile Icon
- Users can upload custom profile images
- Supported formats: JPEG, PNG, GIF, WebP
- Maximum file size: 5MB
- Profile icons are displayed as circular images
- Icons are stored in Supabase Storage
- If no icon is set, a circular avatar with the user's initial is displayed

## Files Created

1. **src/pages/Settings.jsx** - Main settings page component
2. **src/auth/updateEmail.js** - Function to update user email
3. **src/auth/updatePassword.js** - Function to update user password
4. **src/auth/updateProfile.js** - Functions to update username and profile icon
5. **supabase_add_profile_icon.sql** - SQL to add profile_icon column
6. **supabase_storage_setup.sql** - SQL to set up storage bucket and policies

## Files Modified

1. **src/App.jsx** - Added `/settings` route
2. **src/pages/Dashboard.jsx** - Added Settings button and profile icon display

## Accessing Settings

Users can access the Settings page by:
1. Clicking the "Settings" button in the Dashboard
2. Navigating directly to `/settings` URL

## UI Features

- Modern, clean design matching your existing UI style
- Circular profile icons (like most modern platforms)
- Form validation and error handling
- Success messages for completed actions
- Loading states for all operations
- Responsive design

## Testing

After setup, test the following:
1. ✅ Update email address (check for verification email)
2. ✅ Change password (try logging in with new password)
3. ✅ Update username (verify uniqueness)
4. ✅ Upload profile icon (check circular display)
5. ✅ Navigate between Dashboard and Settings

## Troubleshooting

### Profile icon upload fails
- Verify the `profile-icons` bucket exists in Supabase Storage
- Check that storage policies are correctly set up
- Ensure the bucket is set to public

### Email update doesn't work
- Check Supabase email settings
- Verify SMTP is configured (see EMAIL_SETUP.md)

### Username already taken error
- This is expected behavior - usernames must be unique
- Try a different username

## Notes

- Profile icons are stored in Supabase Storage under the `profile-icons` bucket
- The profile icon URL is stored in the `user_profile.profile_icon` column
- All updates require the user to be authenticated
- Email changes require verification via email

