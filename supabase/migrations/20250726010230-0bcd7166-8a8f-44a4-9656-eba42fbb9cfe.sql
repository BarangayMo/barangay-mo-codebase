-- Create a comprehensive sync function to ensure all approved officials have proper profile data
-- This function will be used to sync data for all current and future approved officials

CREATE OR REPLACE FUNCTION public.sync_approved_officials_to_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update profiles for all approved officials where data is missing or outdated
  UPDATE public.profiles 
  SET 
    barangay = o.barangay,
    municipality = o.municipality,
    province = o.province,
    region = o.region,
    phone_number = o.phone_number,
    landline_number = o.landline_number,
    first_name = o.first_name,
    last_name = o.last_name,
    middle_name = o.middle_name,
    suffix = o.suffix,
    is_approved = true,
    updated_at = now()
  FROM public.officials o
  WHERE profiles.id = o.user_id 
    AND o.status = 'approved' 
    AND o.is_approved = true
    AND (
      profiles.barangay IS NULL 
      OR profiles.barangay = '' 
      OR profiles.barangay != o.barangay
      OR profiles.is_approved IS NULL 
      OR profiles.is_approved = false
      OR profiles.municipality != o.municipality
      OR profiles.province != o.province
    );
    
  -- Log the number of records updated
  RAISE NOTICE 'Synced approved officials data to profiles table';
END;
$$;

-- Run the sync function to fix any existing data issues
SELECT public.sync_approved_officials_to_profiles();
