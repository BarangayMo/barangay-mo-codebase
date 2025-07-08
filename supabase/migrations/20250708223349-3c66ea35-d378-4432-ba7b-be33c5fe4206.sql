
-- Add missing columns to profiles table to store all registration data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS middle_name TEXT,
ADD COLUMN IF NOT EXISTS suffix TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS municipality TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS landline_number TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS officials_data JSONB,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create unique constraint on barangay to prevent duplicate registrations
-- Only one official can register per barangay
CREATE UNIQUE INDEX IF NOT EXISTS unique_barangay_official 
ON public.profiles (barangay) 
WHERE role = 'official';

-- Update the handle_new_user function to include all registration data
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
