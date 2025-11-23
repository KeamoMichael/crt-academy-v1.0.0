# Fix for RLS Policy Error During Signup

## Problem
When signing up, you get the error: "new row violates row-level security policy for table 'user_profile'"

This happens because the user isn't fully authenticated yet when trying to insert into the profile table.

## Solution: Database Trigger

I've created a database trigger that automatically creates the user profile when a new user signs up. This runs with elevated privileges, bypassing RLS.

### Steps to Fix:

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Trigger SQL**
   - Copy the contents of `supabase_auto_profile_trigger.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Verify the Trigger**
   - The trigger will automatically create user profiles when new users sign up
   - It uses the username and symbol_locked from the user's metadata

### What the Trigger Does:

- Automatically creates `user_profile` entry when a user signs up
- Automatically creates `user_tool_unlocks` entry
- Automatically creates `user_gamification` entry
- Uses data from `raw_user_meta_data` (username and symbol_locked)
- Runs with `SECURITY DEFINER` privileges, bypassing RLS

### Alternative Solution (If Trigger Doesn't Work):

If you prefer not to use a trigger, you can temporarily disable RLS for inserts:

```sql
-- Allow inserts during signup (less secure, but works)
ALTER TABLE public.user_profile DISABLE ROW LEVEL SECURITY;

-- Or create a more permissive policy
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.user_profile;
CREATE POLICY "Users can insert their own profile."
  ON public.user_profile FOR INSERT
  WITH CHECK (true);
```

**⚠️ Warning:** The alternative solution is less secure. The trigger approach is recommended.

### After Running the Trigger:

1. The signup function has been updated to rely on the trigger
2. Try signing up again - it should work now!
3. The profile will be created automatically

