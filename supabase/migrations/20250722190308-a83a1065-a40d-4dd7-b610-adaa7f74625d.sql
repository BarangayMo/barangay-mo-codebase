-- Insert demo RBI forms for demo users to bypass RBI registration requirement
-- This ensures demo users can access the app without completing RBI registration

-- Insert RBI form for demo resident (will be created when they first log in)
INSERT INTO public.rbi_forms (
  id,
  user_id,
  form_data,
  status,
  submitted_at,
  barangay_id,
  rbi_number
) 
SELECT 
  gen_random_uuid(),
  p.id,
  '{
    "personalDetails": {
      "firstName": "Demo",
      "lastName": "Resident",
      "middleName": "",
      "suffix": "",
      "sex": "Male",
      "dateOfBirth": "1990-01-01",
      "placeOfBirth": "Sample City",
      "civilStatus": "Single",
      "citizenship": "Filipino",
      "religion": "Catholic"
    },
    "addressDetails": {
      "purok": "1",
      "street": "Demo Street",
      "barangay": "Sample Barangay"
    }
  }'::jsonb,
  'approved',
  now(),
  'sample-barangay',
  'RBI-DEMO-001'
FROM public.profiles p 
WHERE p.email = 'demo.resident@smartbarangay.ph'
ON CONFLICT (user_id) DO NOTHING;

-- Also handle the case where the demo user doesn't exist yet by creating a function
-- that will be called when demo users are created
CREATE OR REPLACE FUNCTION public.create_demo_rbi_form()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create RBI form for demo users
  IF NEW.email LIKE 'demo.%@smartbarangay.ph' AND NEW.role = 'resident' THEN
    INSERT INTO public.rbi_forms (
      id,
      user_id,
      form_data,
      status,
      submitted_at,
      barangay_id,
      rbi_number
    ) VALUES (
      gen_random_uuid(),
      NEW.id,
      '{
        "personalDetails": {
          "firstName": "Demo",
          "lastName": "Resident",
          "middleName": "",
          "suffix": "",
          "sex": "Male",
          "dateOfBirth": "1990-01-01",
          "placeOfBirth": "Sample City",
          "civilStatus": "Single",
          "citizenship": "Filipino",
          "religion": "Catholic"
        },
        "addressDetails": {
          "purok": "1",
          "street": "Demo Street",
          "barangay": "Sample Barangay"
        }
      }'::jsonb,
      'approved',
      now(),
      'sample-barangay',
      'RBI-DEMO-' || substr(NEW.id::text, 1, 6)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create RBI forms for demo users
DROP TRIGGER IF EXISTS create_demo_rbi_form_trigger ON public.profiles;
CREATE TRIGGER create_demo_rbi_form_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_demo_rbi_form();