-- Drop the current policy
DROP POLICY "Officials can update rbi-forms in their barangay" ON public.rbi_forms;

-- Create updated policy that handles missing profiles
CREATE POLICY "Officials can update rbi-forms in their barangay" ON public.rbi_forms
FOR UPDATE USING (
  -- Current user must be an official (this check stays strict)
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'official'::user_role
  AND 
  -- Official's barangay must match the RBI form's barangay_id
  rbi_forms.barangay_id = (SELECT barangay FROM profiles WHERE id = auth.uid())
  -- Removed the resident role check to handle missing profiles
)
WITH CHECK (
  -- Can only update status to approved or rejected
  status = ANY (ARRAY['approved'::rbi_status, 'rejected'::rbi_status])
);