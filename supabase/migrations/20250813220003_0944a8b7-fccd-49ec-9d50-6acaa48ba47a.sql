-- Fix the handle_new_user function to properly create profiles for all users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
  metadata_role TEXT;
BEGIN
  -- Add error handling and logging
  RAISE LOG 'handle_new_user triggered for user: %', NEW.id;
  RAISE LOG 'NEW.raw_user_meta_data: %', NEW.raw_user_meta_data;
  
  -- Extract role from raw_user_meta_data (correct field name)
  BEGIN
    metadata_role := NEW.raw_user_meta_data->>'role';
    RAISE LOG 'Extracted metadata_role: %', metadata_role;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error extracting role from metadata: %', SQLERRM;
    metadata_role := NULL;
  END;

  -- Set user_role based on metadata, default to resident
  IF metadata_role = 'official' THEN
    user_role := 'official';
    RAISE LOG 'Creating profile for official user: %', NEW.id;
  ELSIF metadata_role = 'superadmin' THEN
    user_role := 'superadmin';
    RAISE LOG 'Creating profile for superadmin user: %', NEW.id;
  ELSE
    user_role := 'resident';
    RAISE LOG 'Creating profile for resident user: %', NEW.id;
  END IF;

  -- Insert into profiles for ALL users (residents, officials, and superadmins)
  BEGIN
    INSERT INTO public.profiles (
      id, first_name, last_name, middle_name, suffix, role,
      barangay, region, province, municipality, position, phone_number, 
      landline_number, email, is_approved, created_at, updated_at
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'middle_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'suffix', ''),
      user_role::user_role,
      COALESCE(NEW.raw_user_meta_data->>'barangay', ''),
      COALESCE(NEW.raw_user_meta_data->>'region', ''),
      COALESCE(NEW.raw_user_meta_data->>'province', ''),
      COALESCE(NEW.raw_user_meta_data->>'municipality', ''),
      COALESCE(NEW.raw_user_meta_data->>'position', ''),
      COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
      COALESCE(NEW.raw_user_meta_data->>'landline_number', ''),
      NEW.email,
      CASE 
        WHEN user_role = 'official' THEN true  -- Officials are pre-approved
        WHEN user_role = 'superadmin' THEN true  -- Superadmins are pre-approved
        ELSE false                             -- Residents need approval via RBI
      END,
      now(),
      now()
    );
    RAISE LOG 'Profile created successfully for % user: %', user_role, NEW.id;
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    -- Don't fail the entire user creation, just log the error
  END;

  RETURN NEW;
END;
$$;

-- Create profile for existing user who doesn't have one
INSERT INTO public.profiles (
  id, first_name, last_name, middle_name, suffix, role,
  barangay, region, province, municipality, phone_number, 
  landline_number, email, is_approved, created_at, updated_at
)
SELECT DISTINCT
  u.id,
  COALESCE(u.raw_user_meta_data->>'first_name', ''),
  COALESCE(u.raw_user_meta_data->>'last_name', ''),
  COALESCE(u.raw_user_meta_data->>'middle_name', ''),
  COALESCE(u.raw_user_meta_data->>'suffix', ''),
  COALESCE(u.raw_user_meta_data->>'role', 'resident')::user_role,
  COALESCE(u.raw_user_meta_data->>'barangay', ''),
  COALESCE(u.raw_user_meta_data->>'region', ''),
  COALESCE(u.raw_user_meta_data->>'province', ''),
  COALESCE(u.raw_user_meta_data->>'municipality', ''),
  COALESCE(u.raw_user_meta_data->>'phone_number', ''),
  COALESCE(u.raw_user_meta_data->>'landline_number', ''),
  u.email,
  CASE 
    WHEN COALESCE(u.raw_user_meta_data->>'role', 'resident') = 'official' THEN true
    WHEN COALESCE(u.raw_user_meta_data->>'role', 'resident') = 'superadmin' THEN true
    ELSE false
  END,
  now(),
  now()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
  AND u.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;