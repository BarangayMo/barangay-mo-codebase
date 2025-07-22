-- Add missing INSERT policy for rbi_forms table
-- This allows users to insert their own RBI forms
CREATE POLICY "Users can insert their own RBI forms" 
ON public.rbi_forms 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);