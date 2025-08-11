-- Fix the current official's profile data by syncing with officials table
UPDATE public.profiles 
SET 
  barangay = o.barangay,
  municipality = o.municipality,
  province = o.province,
  region = o.region,
  phone_number = o.phone_number,
  landline_number = o.landline_number,
  is_approved = true,
  updated_at = now()
FROM public.officials o
WHERE profiles.id = o.user_id 
  AND o.status = 'approved' 
  AND o.is_approved = true
  AND (profiles.barangay IS NULL OR profiles.barangay = '' OR profiles.is_approved IS NULL);