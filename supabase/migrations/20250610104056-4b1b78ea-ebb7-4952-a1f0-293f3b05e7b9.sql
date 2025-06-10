
-- Create a sequence for job codes
CREATE SEQUENCE IF NOT EXISTS job_code_seq START 1;

-- Add job_code column to jobs table if it doesn't exist
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_code TEXT;

-- Create function to generate job codes
CREATE OR REPLACE FUNCTION generate_job_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    next_id INTEGER;
    current_year INTEGER;
BEGIN
    SELECT EXTRACT(YEAR FROM NOW()) INTO current_year;
    SELECT nextval('job_code_seq') INTO next_id;
    RETURN 'JOB-' || current_year || '-' || LPAD(next_id::TEXT, 3, '0');
END;
$$;

-- Create trigger function to auto-set job code
CREATE OR REPLACE FUNCTION set_job_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.job_code IS NULL THEN
        NEW.job_code := generate_job_code();
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger to auto-generate job code on insert
DROP TRIGGER IF EXISTS set_job_code_trigger ON jobs;
CREATE TRIGGER set_job_code_trigger
    BEFORE INSERT ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION set_job_code();
