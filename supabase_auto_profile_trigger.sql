-- Database trigger to automatically create user profile when a new user signs up
-- This runs with elevated privileges, bypassing RLS

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_profile using the user's metadata
  INSERT INTO public.user_profile (user_id, username, symbol_locked)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'symbol_locked', 'XAUUSD')
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Initialize tool unlocks
  INSERT INTO public.user_tool_unlocks (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Initialize gamification defaults
  INSERT INTO public.user_gamification (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
-- This trigger fires AFTER a new user is inserted
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


