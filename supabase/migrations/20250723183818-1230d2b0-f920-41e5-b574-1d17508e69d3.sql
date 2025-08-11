-- Fix the missing profiles by manually creating them for existing auth users
INSERT INTO public.profiles (
  id, 
  email,
  created_at,
  updated_at
)
SELECT 
  id,
  email,
  created_at,
  now()
FROM auth.users 
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Also ensure the trigger is properly recreated
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

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
    phone_number,
    landline_number,
    barangay,
    municipality,
    province,
    region,
    role,
    email
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'middle_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'suffix', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone_number', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'landline_number', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'barangay', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'municipality', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'province', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'region', ''),
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'resident' THEN 'resident'::user_role
      WHEN NEW.raw_user_meta_data ->> 'role' = 'official' THEN 'official'::user_role
      WHEN NEW.raw_user_meta_data ->> 'role' = 'superadmin' THEN 'superadmin'::user_role
      ELSE 'resident'::user_role
    END,
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();