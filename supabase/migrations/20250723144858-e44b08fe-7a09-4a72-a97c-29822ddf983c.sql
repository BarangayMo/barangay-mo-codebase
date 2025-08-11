-- Create enum for RBI form status
CREATE TYPE public.rbi_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'pending_documents');

-- Add admin_notes column to rbi_forms if not exists
ALTER TABLE public.rbi_forms 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Remove default before changing type
ALTER TABLE public.rbi_forms 
ALTER COLUMN status DROP DEFAULT;

-- Update status column to use the enum type
ALTER TABLE public.rbi_forms 
ALTER COLUMN status TYPE rbi_status USING status::rbi_status;

-- Set default status to 'submitted'
ALTER TABLE public.rbi_forms 
ALTER COLUMN status SET DEFAULT 'submitted'::rbi_status;

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_rbi_forms_status ON public.rbi_forms(status);
CREATE INDEX IF NOT EXISTS idx_rbi_forms_barangay_status ON public.rbi_forms(barangay_id, status);

-- Create updated_at column and trigger for tracking changes
ALTER TABLE public.rbi_forms 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_rbi_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_rbi_forms_updated_at ON public.rbi_forms;

CREATE TRIGGER update_rbi_forms_updated_at
  BEFORE UPDATE ON public.rbi_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_rbi_forms_updated_at();