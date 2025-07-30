-- Fix the handle_new_user trigger to properly respect the role metadata
-- This ensures officials get the correct role instead of defaulting to 'resident'

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Extract role from user_metadata first, then raw_user_meta_data, then app_metadata
  -- This ensures the role is properly preserved from the Edge Function
  DECLARE
    user_role TEXT;
  BEGIN
    -- Priority order: user_metadata.role > raw_user_meta_data.role > app_metadata.role > default 'resident'
    user_role := COALESCE(
      NEW.user_metadata->>'role',
      NEW.raw_user_meta_data->>'role', 
      NEW.app_metadata->>'role',
      'resident'
    );
    
    -- Log for debugging
    RAISE LOG 'Creating profile for user % with role: %, metadata: %', NEW.id, user_role, NEW.user_metadata;
    
    INSERT INTO public.profiles (
      id, 
      first_name, 
      last_name, 
      middle_name,
      suffix,
      role,
      barangay,
      region,
      province,
      municipality,
      phone_number,
      landline_number,
      logo_url,
      officials_data,
      email,
      is_approved
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.user_metadata->>'first_name', NEW.raw_user_meta_data->>'first_name'),
      COALESCE(NEW.user_metadata->>'last_name', NEW.raw_user_meta_data->>'last_name'),
      COALESCE(NEW.user_metadata->>'middle_name', NEW.raw_user_meta_data->>'middle_name'),
      COALESCE(NEW.user_metadata->>'suffix', NEW.raw_user_meta_data->>'suffix'),
      user_role::user_role, -- Use the extracted role
      COALESCE(NEW.user_metadata->>'barangay', NEW.raw_user_meta_data->>'barangay'),
      COALESCE(NEW.user_metadata->>'region', NEW.raw_user_meta_data->>'region'),
      COALESCE(NEW.user_metadata->>'province', NEW.raw_user_meta_data->>'province'),
      COALESCE(NEW.user_metadata->>'municipality', NEW.raw_user_meta_data->>'municipality'),
      COALESCE(NEW.user_metadata->>'phone_number', NEW.raw_user_meta_data->>'phone_number'),
      COALESCE(NEW.user_metadata->>'landline_number', NEW.raw_user_meta_data->>'landline_number'),
      COALESCE(NEW.user_metadata->>'logo_url', NEW.raw_user_meta_data->>'logo_url'),
      CASE 
        WHEN COALESCE(NEW.user_metadata->>'officials', NEW.raw_user_meta_data->>'officials') IS NOT NULL 
        THEN COALESCE(NEW.user_metadata->'officials', NEW.raw_user_meta_data->'officials')
        ELSE NULL 
      END,
      NEW.email,
      CASE 
        WHEN user_role = 'official' THEN true
        ELSE false
      END
    );
    
    RETURN NEW;
  END;
END;
$$;

-- Also create a function to fix existing profiles that were incorrectly created as residents
-- but should be officials based on their auth metadata
CREATE OR REPLACE FUNCTION public.fix_official_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update profiles where the auth user has role='official' in metadata but profile has role='resident'
  UPDATE public.profiles 
  SET 
    role = 'official',
    is_approved = true,
    updated_at = now()
  FROM auth.users
  WHERE profiles.id = auth.users.id
    AND profiles.role = 'resident'
    AND (
      auth.users.user_metadata->>'role' = 'official' 
      OR auth.users.raw_user_meta_data->>'role' = 'official'
      OR auth.users.app_metadata->>'role' = 'official'
    );
    
  -- Log the number of profiles fixed
  GET DIAGNOSTICS FOUND_ROWS = ROW_COUNT;
  RAISE NOTICE 'Fixed % official profiles that were incorrectly set as residents', FOUND_ROWS;
END;
$$;

-- Run the fix function to correct any existing profiles
SELECT public.fix_official_profiles();
