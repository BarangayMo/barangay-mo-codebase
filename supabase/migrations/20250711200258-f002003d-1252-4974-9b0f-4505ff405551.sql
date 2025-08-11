
-- Ensure the user_role enum type exists
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('resident', 'official', 'superadmin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Make sure the profiles table role column uses the enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- Recreate the handle_new_user function to ensure it works with the enum
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
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
    email
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'middle_name',
    NEW.raw_user_meta_data->>'suffix',
    COALESCE(NEW.raw_user_meta_data->>'role', 'resident')::user_role,
    NEW.raw_user_meta_data->>'barangay',
    NEW.raw_user_meta_data->>'region',
    NEW.raw_user_meta_data->>'province',
    NEW.raw_user_meta_data->>'municipality',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'landline_number',
    NEW.raw_user_meta_data->>'logo_url',
    CASE 
      WHEN NEW.raw_user_meta_data->>'officials' IS NOT NULL 
      THEN NEW.raw_user_meta_data->'officials'
      ELSE NULL 
    END,
    NEW.email
  );
  RETURN NEW;
END;
$$;
