-- Create function to handle RBI form approval and profile creation
CREATE OR REPLACE FUNCTION public.handle_rbi_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  form_data_obj JSONB;
  personal_details JSONB;
  address_details JSONB;
  other_details JSONB;
BEGIN
  -- Only process when status changes to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    form_data_obj := NEW.form_data;
    personal_details := form_data_obj->'personalDetails';
    address_details := form_data_obj->'address';
    other_details := form_data_obj->'otherDetails';
    
    -- Insert or update profile with RBI form data
    INSERT INTO public.profiles (
      id,
      first_name,
      last_name,
      middle_name,
      suffix,
      email,
      phone_number,
      barangay,
      municipality,
      province,
      region,
      role,
      is_approved,
      created_at,
      updated_at
    ) VALUES (
      NEW.user_id,
      COALESCE(personal_details->>'firstName', ''),
      COALESCE(personal_details->>'lastName', ''),
      COALESCE(personal_details->>'middleName', ''),
      COALESCE(personal_details->>'suffix', ''),
      COALESCE(other_details->>'email', ''),
      COALESCE(other_details->>'contactNumber', ''),
      COALESCE(address_details->>'barangay', NEW.barangay_id, ''),
      COALESCE(address_details->>'municipality', ''),
      COALESCE(address_details->>'province', ''),
      COALESCE(address_details->>'region', ''),
      'resident'::user_role,
      true,
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      first_name = COALESCE(personal_details->>'firstName', profiles.first_name),
      last_name = COALESCE(personal_details->>'lastName', profiles.last_name),
      middle_name = COALESCE(personal_details->>'middleName', profiles.middle_name),
      suffix = COALESCE(personal_details->>'suffix', profiles.suffix),
      email = COALESCE(other_details->>'email', profiles.email),
      phone_number = COALESCE(other_details->>'contactNumber', profiles.phone_number),
      barangay = COALESCE(address_details->>'barangay', NEW.barangay_id, profiles.barangay),
      municipality = COALESCE(address_details->>'municipality', profiles.municipality),
      province = COALESCE(address_details->>'province', profiles.province),
      region = COALESCE(address_details->>'region', profiles.region),
      is_approved = true,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for RBI form approval
CREATE TRIGGER trigger_rbi_approval
  AFTER UPDATE ON public.rbi_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_rbi_approval();

-- Create profiles for existing approved RBI forms that don't have profiles
INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  middle_name,
  suffix,
  email,
  phone_number,
  barangay,
  municipality,
  province,
  region,
  role,
  is_approved,
  created_at,
  updated_at
)
SELECT DISTINCT
  r.user_id,
  COALESCE(r.form_data->'personalDetails'->>'firstName', ''),
  COALESCE(r.form_data->'personalDetails'->>'lastName', ''),
  COALESCE(r.form_data->'personalDetails'->>'middleName', ''),
  COALESCE(r.form_data->'personalDetails'->>'suffix', ''),
  COALESCE(r.form_data->'otherDetails'->>'email', ''),
  COALESCE(r.form_data->'otherDetails'->>'contactNumber', ''),
  COALESCE(r.form_data->'address'->>'barangay', r.barangay_id, ''),
  COALESCE(r.form_data->'address'->>'municipality', ''),
  COALESCE(r.form_data->'address'->>'province', ''),
  COALESCE(r.form_data->'address'->>'region', ''),
  'resident'::user_role,
  true,
  now(),
  now()
FROM public.rbi_forms r
LEFT JOIN public.profiles p ON p.id = r.user_id
WHERE r.status = 'approved' 
  AND p.id IS NULL
  AND r.user_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;