-- Database trigger to send welcome email after user confirms their email
-- This trigger fires when a user's email is confirmed in auth.users

-- First, enable the pg_net extension if not already enabled (for HTTP requests)
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to send welcome email via Supabase Edge Function or external service
CREATE OR REPLACE FUNCTION public.send_welcome_email()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_username TEXT;
BEGIN
  -- Only send email if email is confirmed (email_confirmed_at is not null)
  IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) THEN
    -- Get user email
    user_email := NEW.email;
    
    -- Get username from user_profile
    SELECT username INTO user_username
    FROM public.user_profile
    WHERE user_id = NEW.id;
    
    -- Call Supabase Edge Function to send welcome email
    -- Replace 'your-project-ref' with your actual Supabase project reference
    -- You'll need to create an Edge Function to handle the email sending
    PERFORM
      net.http_post(
        url := 'https://kdhqkhqmowywlknmuytf.supabase.co/functions/v1/send-welcome-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := jsonb_build_object(
          'email', user_email,
          'username', COALESCE(user_username, 'there'),
          'user_id', NEW.id
        )
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
-- Note: This needs to be run in the Supabase SQL Editor with proper permissions
DROP TRIGGER IF EXISTS on_user_email_confirmed ON auth.users;
CREATE TRIGGER on_user_email_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_email();

-- Alternative: Simpler approach using Supabase's built-in email system
-- You can also use Supabase's email templates directly in the dashboard:
-- 1. Go to Authentication > Email Templates
-- 2. Customize the "Confirm signup" template
-- 3. Add a "Welcome" email template that gets sent after confirmation

-- For a simpler implementation without Edge Functions, you can:
-- 1. Customize email templates in Supabase Dashboard (Authentication > Email Templates)
-- 2. Use the "Confirm signup" template to include welcome information
-- 3. Or create a webhook that triggers on user confirmation


