-- First, let's also check and fix the set_rbi_number trigger function that might have similar issues
CREATE OR REPLACE FUNCTION public.set_rbi_number()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  user_barangay TEXT;
BEGIN
  -- Only generate RBI number for submitted forms that don't already have one
  IF NEW.status = 'submitted' AND NEW.rbi_number IS NULL THEN
    -- Extract barangay from user's profile
    SELECT profiles.barangay INTO user_barangay
    FROM public.profiles
    WHERE profiles.id = NEW.user_id;
    
    -- If no barangay in profile, try to extract from form data
    IF user_barangay IS NULL THEN
      user_barangay := COALESCE(NEW.form_data->>'address'->>'barangay', 'Unknown');
    END IF;
    
    -- Generate RBI number
    NEW.rbi_number := public.generate_rbi_number(user_barangay);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Also, let's make sure the rbi_sequences table exists and has the right structure
CREATE TABLE IF NOT EXISTS public.rbi_sequences (
  barangay_code TEXT NOT NULL,
  year INTEGER NOT NULL,
  last_sequence INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (barangay_code, year)
);

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS trigger_set_rbi_number ON public.rbi_forms;
CREATE TRIGGER trigger_set_rbi_number
  BEFORE INSERT OR UPDATE ON public.rbi_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.set_rbi_number();