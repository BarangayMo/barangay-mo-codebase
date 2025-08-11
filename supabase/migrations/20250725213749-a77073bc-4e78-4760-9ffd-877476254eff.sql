-- Remove the existing permissive RLS policy for anyone to insert
DROP POLICY IF EXISTS "Anyone can insert pending officials" ON public.officials;

-- Create a more restrictive policy that only allows service role insertions
-- This ensures only the Edge Function can insert into the officials table
CREATE POLICY "Only Edge Function can insert officials" 
ON public.officials FOR INSERT 
TO service_role 
WITH CHECK (true);

-- Ensure RLS is enabled on the officials table
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;