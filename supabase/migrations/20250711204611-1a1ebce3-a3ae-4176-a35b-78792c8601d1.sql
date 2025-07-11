
-- First, let's recreate the handle_new_user function with proper schema references
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
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
    COALESCE(NEW.raw_user_meta_data->>'role', 'resident')::public.user_role,
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

-- Also, let's ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Grant necessary permissions to ensure the function can execute properly
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;
