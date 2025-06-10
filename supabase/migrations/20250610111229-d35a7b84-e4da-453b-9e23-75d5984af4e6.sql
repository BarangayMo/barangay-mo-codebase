
-- Add missing columns to the jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES auth.users(id);

-- Create an index on the slug column for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON public.jobs(slug);

-- Create an index on assigned_to for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_to ON public.jobs(assigned_to);
