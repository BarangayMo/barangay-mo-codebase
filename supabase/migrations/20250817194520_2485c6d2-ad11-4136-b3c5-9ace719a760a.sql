-- Allow officials to update Barangay records for their own barangay
CREATE POLICY "Officials can update their barangay data" 
ON public."Barangays"
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'official'::user_role
    AND profiles.barangay = "Barangays"."BARANGAY"
  )
);