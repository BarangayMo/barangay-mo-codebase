
-- Enable Row Level Security on rbi_sequences table
ALTER TABLE public.rbi_sequences ENABLE ROW LEVEL SECURITY;

-- Create policy to restrict access to rbi_sequences table
-- Only allow system functions to access this table (used for generating RBI numbers)
CREATE POLICY "Only system functions can access rbi_sequences" 
  ON public.rbi_sequences 
  FOR ALL 
  USING (false);

-- Since this table is only used internally by the generate_rbi_number function,
-- we don't need any user-facing policies. The function uses SECURITY DEFINER
-- which bypasses RLS when generating RBI numbers.
