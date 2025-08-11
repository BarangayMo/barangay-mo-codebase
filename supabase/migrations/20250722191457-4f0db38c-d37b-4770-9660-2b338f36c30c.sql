-- Insert demo RBI forms for demo users to bypass RBI registration requirement
-- This ensures demo users can access the app without completing RBI registration

-- Create function to create demo RBI forms for demo users
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
      'RBI-DEMO-' || substring(NEW.id::text from 1 for 6)
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

-- For existing demo users, insert RBI form if they don't have one
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
  'RBI-DEMO-' || substring(p.id::text from 1 for 6)
FROM public.profiles p 
WHERE p.email LIKE 'demo.%@smartbarangay.ph' 
  AND p.role = 'resident'
  AND NOT EXISTS (
    SELECT 1 FROM public.rbi_forms rf WHERE rf.user_id = p.id
  );