
-- First, let's add the missing cover_letter column to the existing table
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS cover_letter TEXT;

-- Update the status column to have the correct constraints
ALTER TABLE public.job_applications DROP CONSTRAINT IF EXISTS job_applications_status_check;
ALTER TABLE public.job_applications ADD CONSTRAINT job_applications_status_check 
  CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'applied'));

-- Add missing columns if they don't exist
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS if not already enabled
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them
DROP POLICY IF EXISTS "Anyone can view job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Anyone can create job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can update job applications" ON public.job_applications;

-- Create new policies
CREATE POLICY "Anyone can view job applications" 
  ON public.job_applications 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create job applications" 
  ON public.job_applications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update job applications" 
  ON public.job_applications 
  FOR UPDATE 
  USING (true);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_job_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_job_applications_updated_at_trigger ON public.job_applications;
CREATE TRIGGER update_job_applications_updated_at_trigger
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_job_applications_updated_at();

-- Insert sample data with existing column structure
INSERT INTO public.job_applications (job_id, applicant_name, applicant_email, applicant_phone, cover_letter, status) 
SELECT 
  j.id,
  CASE 
    WHEN random() < 0.3 THEN 'Maria Santos'
    WHEN random() < 0.6 THEN 'Juan Dela Cruz'
    ELSE 'Ana Reyes'
  END,
  CASE 
    WHEN random() < 0.3 THEN 'maria.santos@email.com'
    WHEN random() < 0.6 THEN 'juan.delacruz@email.com'
    ELSE 'ana.reyes@email.com'
  END,
  CASE 
    WHEN random() < 0.5 THEN '+63 917 123 4567'
    ELSE '+63 918 765 4321'
  END,
  'I am very interested in this position and believe I would be a great fit for your team. I have relevant experience and would love to contribute to your organization.',
  CASE 
    WHEN random() < 0.3 THEN 'pending'
    WHEN random() < 0.6 THEN 'reviewing'
    WHEN random() < 0.8 THEN 'approved'
    ELSE 'rejected'
  END
FROM public.jobs j
WHERE NOT EXISTS (
  SELECT 1 FROM public.job_applications ja WHERE ja.job_id = j.id
)
LIMIT 10;
