-- Add unique constraint to prevent duplicate officials with same email and barangay
ALTER TABLE public.officials 
ADD CONSTRAINT unique_barangay_official 
UNIQUE (barangay, email);