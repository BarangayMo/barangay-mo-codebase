-- First, remove the barangay from the old unapproved official profile to avoid constraint conflict
UPDATE public.profiles 
SET barangay = NULL 
WHERE email = 'walterodibi@gmail.com' AND is_approved = false;

-- Now update the approved official's profile with the correct barangay data
UPDATE public.profiles 
SET 
  barangay = 'Adams',
  municipality = 'ADAMS',
  province = 'ILOCOS NORTE',
  region = 'REGION 1',
  phone_number = '03064476906',
  is_approved = true,
  updated_at = now()
WHERE email = 'abdulrt1529@gmail.com' AND role = 'official';