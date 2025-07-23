-- Create RBI draft forms table for auto-saving form progress
CREATE TABLE IF NOT EXISTS public.rbi_draft_forms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data jsonb NOT NULL DEFAULT '{}',
  last_completed_step integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rbi_draft_forms ENABLE ROW LEVEL SECURITY;

-- Create policies for RBI draft forms
CREATE POLICY "Users can manage their own draft forms" 
ON public.rbi_draft_forms 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create unique constraint to ensure one draft per user
CREATE UNIQUE INDEX IF NOT EXISTS rbi_draft_forms_user_id_unique 
ON public.rbi_draft_forms (user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_rbi_draft_forms_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_rbi_draft_forms_updated_at_trigger
  BEFORE UPDATE ON public.rbi_draft_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_rbi_draft_forms_updated_at();