
-- Fix the user_role enum and handle_new_user function to prevent database errors
-- First, ensure the user_role enum is properly created in the public schema
DO $$ BEGIN
    -- Drop and recreate the enum to ensure it's properly defined
    DROP TYPE IF EXISTS public.user_role CASCADE;
    CREATE TYPE public.user_role AS ENUM ('resident', 'official', 'superadmin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the profiles table to use the enum properly
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE public.user_role USING role::public.user_role;

-- Recreate the handle_new_user function with better error handling and proper schema references
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
DECLARE
    user_role_value public.user_role;
BEGIN
    -- Safely cast the role with fallback to 'resident'
    BEGIN
        user_role_value := COALESCE(NEW.raw_user_meta_data->>'role', 'resident')::public.user_role;
    EXCEPTION
        WHEN invalid_text_representation THEN
            user_role_value := 'resident'::public.user_role;
    END;

    -- Insert the new profile with proper error handling
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
        user_role_value,
        NEW.raw_user_meta_data->>'barangay',
        NEW.raw_user_meta_data->>'region',
        NEW.raw_user_meta_data->>'province',
        NEW.raw_user_meta_data->>'municipality',
        NEW.raw_user_meta_data->>'phone_number',
        NEW.raw_user_meta_data->>'landline_number',
        NEW.raw_user_meta_data->>'logo_url',
        CASE 
            WHEN NEW.raw_user_meta_data->>'officials' IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'officials')::jsonb
            ELSE NULL 
        END,
        NEW.email
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't block user creation
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- THIS IS THE CRITICAL PART: Recreate the missing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();
