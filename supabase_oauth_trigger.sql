-- Database trigger to automatically create profile records when OAuth users sign up
-- Run this in your Supabase SQL Editor

-- Create a function to handle new OAuth user creation
CREATE OR REPLACE FUNCTION public.handle_new_oauth_user()
RETURNS trigger AS $$
BEGIN
  -- Insert new profile record for OAuth users
  INSERT INTO public.profiles (
    id,
    user_id,
    name,
    company,
    role,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'user_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'company',
    'CLIENT'::public."UserRole", -- Default role, cast to enum type
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    ),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  -- If there's a conflict (user already exists), ignore the error
  WHEN unique_violation THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger for new auth users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_oauth_user();

-- Optional: Create a function to update profile when auth user metadata changes
CREATE OR REPLACE FUNCTION public.handle_oauth_user_update()
RETURNS trigger AS $$
BEGIN
  -- Update existing profile with new OAuth data
  UPDATE public.profiles
  SET
    name = COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'user_name',
      name -- Keep existing name if no new name available
    ),
    avatar_url = COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      avatar_url -- Keep existing avatar if no new avatar available
    ),
    updated_at = NOW()
  WHERE user_id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger for auth user updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_oauth_user_update();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;

-- Enable Row Level Security on profiles table (recommended)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to access their own profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for service role to insert profiles (for OAuth trigger)
CREATE POLICY "Service role can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Optional: Create a function to get profile data for the current user
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS json AS $$
DECLARE
  profile_data json;
BEGIN
  SELECT row_to_json(p.*) INTO profile_data
  FROM public.profiles p
  WHERE p.user_id = auth.uid();

  RETURN profile_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_current_user_profile() TO authenticated;