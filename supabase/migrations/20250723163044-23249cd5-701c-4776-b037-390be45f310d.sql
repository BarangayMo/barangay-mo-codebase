-- Update existing RBI forms to have correct barangay_id that matches officials' barangay
-- First, let's update the forms to match available officials

UPDATE public.rbi_forms 
SET barangay_id = 'Adams'
WHERE id = '8a0fc173-bd79-4dfa-ae7e-2b395f57db95';

UPDATE public.rbi_forms 
SET barangay_id = 'Valeriana, Zaragoza, Nueva Ecija'
WHERE id = '733ef0a2-092b-461d-889c-77a3a5e598da';

-- Also update the profiles of these users to match their forms
UPDATE public.profiles 
SET barangay = 'Adams'
WHERE id = 'b66eabdb-90d4-476e-8194-61cbb799b775';

UPDATE public.profiles 
SET barangay = 'Valeriana, Zaragoza, Nueva Ecija'
WHERE id = '65e2819a-f83f-4562-8ba4-23a6d242601f';