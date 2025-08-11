-- Add created_by field to jobs table to track who posted the job
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON public.jobs(created_by);