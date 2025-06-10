
-- Add auto-generated job_code field to jobs table
ALTER TABLE public.jobs ADD COLUMN job_code TEXT;

-- Create sequence for job codes
CREATE SEQUENCE job_code_seq START 1;

-- Create function to generate job codes
CREATE OR REPLACE FUNCTION generate_job_code()
RETURNS TEXT AS $$
DECLARE
    next_id INTEGER;
    current_year INTEGER;
BEGIN
    SELECT EXTRACT(YEAR FROM NOW()) INTO current_year;
    SELECT nextval('job_code_seq') INTO next_id;
    RETURN 'JOB-' || current_year || '-' || LPAD(next_id::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate job codes
CREATE OR REPLACE FUNCTION set_job_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.job_code IS NULL THEN
        NEW.job_code := generate_job_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_job_code
    BEFORE INSERT ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION set_job_code();

-- Update existing jobs with job codes
UPDATE public.jobs 
SET job_code = generate_job_code() 
WHERE job_code IS NULL;

-- Create job_applications table for talent management
CREATE TABLE public.job_applications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT,
    age INTEGER,
    gender TEXT,
    experience_years INTEGER,
    expected_salary TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'interviewed', 'hired', 'rejected')),
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view applications
CREATE POLICY "Allow authenticated users to view applications" 
ON public.job_applications FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to insert applications
CREATE POLICY "Allow authenticated users to insert applications" 
ON public.job_applications FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to update applications
CREATE POLICY "Allow authenticated users to update applications" 
ON public.job_applications FOR UPDATE 
TO authenticated 
USING (true);

-- Insert sample job applications data
INSERT INTO public.job_applications (job_id, applicant_name, applicant_email, age, gender, experience_years, expected_salary, rating, status) 
SELECT 
    j.id,
    CASE (random() * 4)::int
        WHEN 0 THEN 'Suriyan Pinwan'
        WHEN 1 THEN 'Phuvanat Suwannawong'
        WHEN 2 THEN 'Waradet Chinawat'
        WHEN 3 THEN 'Suwannee Wongsuwan'
        ELSE 'Alex Somchai'
    END,
    CASE (random() * 4)::int
        WHEN 0 THEN 'suriyan@email.com'
        WHEN 1 THEN 'phuvanat@email.com'
        WHEN 2 THEN 'waradet@email.com'
        WHEN 3 THEN 'suwannee@email.com'
        ELSE 'alex@email.com'
    END,
    20 + (random() * 15)::int,
    CASE WHEN random() > 0.5 THEN 'Male' ELSE 'Female' END,
    1 + (random() * 10)::int,
    'THB ' || (200 + (random() * 400)::int),
    3.5 + (random() * 1.5),
    CASE (random() * 4)::int
        WHEN 0 THEN 'applied'
        WHEN 1 THEN 'shortlisted'
        WHEN 2 THEN 'interviewed'
        ELSE 'applied'
    END
FROM public.jobs j
LIMIT 5;
