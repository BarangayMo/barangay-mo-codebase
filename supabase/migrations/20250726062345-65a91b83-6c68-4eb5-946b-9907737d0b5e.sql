-- Add columns to track reviewer type and decision hierarchy
ALTER TABLE public.rbi_forms 
ADD COLUMN reviewer_type TEXT, -- 'official' or 'superadmin'
ADD COLUMN decision_precedence INTEGER DEFAULT 1; -- 1 for official, 2 for superadmin (higher precedence)

-- Update existing forms to have proper barangay_id based on form data
UPDATE public.rbi_forms 
SET barangay_id = form_data->>'address'->>'barangay'
WHERE barangay_id IS NULL AND form_data->>'address'->>'barangay' IS NOT NULL;

-- Create index for better performance on barangay filtering
CREATE INDEX IF NOT EXISTS idx_rbi_forms_barangay_id ON public.rbi_forms(barangay_id);
CREATE INDEX IF NOT EXISTS idx_rbi_forms_status ON public.rbi_forms(status);

-- Add trigger to update decision precedence when form is reviewed
CREATE OR REPLACE FUNCTION update_rbi_decision_precedence()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reviewed_by IS NOT NULL AND OLD.reviewed_by IS DISTINCT FROM NEW.reviewed_by THEN
    -- Check if reviewer is superadmin
    IF EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = NEW.reviewed_by AND role = 'superadmin'
    ) THEN
      NEW.decision_precedence = 2;
      NEW.reviewer_type = 'superadmin';
    ELSE
      -- Check if reviewer is official
      IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = NEW.reviewed_by AND role = 'official'
      ) THEN
        NEW.decision_precedence = 1;
        NEW.reviewer_type = 'official';
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rbi_decision_precedence
  BEFORE UPDATE ON public.rbi_forms
  FOR EACH ROW EXECUTE FUNCTION update_rbi_decision_precedence();