-- Drop the broken policy
DROP POLICY "Officials can update rbi-forms in their barangay" ON public.rbi_forms;

-- Create the corrected policy with proper barangay comparison
CREATE POLICY "Officials can update rbi-forms in their barangay" ON public.rbi_forms
FOR UPDATE USING (
  -- Current user is an official
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'official'::user_role
  AND 
  -- Form belongs to a resident
  (SELECT role FROM profiles WHERE id = rbi_forms.user_id) = 'resident'::user_role  
  AND 
  -- Official's barangay matches the RBI form's barangay_id
  rbi_forms.barangay_id = (SELECT barangay FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
  -- Can only update status to approved or rejected
  status = ANY (ARRAY['approved'::rbi_status, 'rejected'::rbi_status])
);