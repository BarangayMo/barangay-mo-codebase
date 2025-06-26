
-- Add rbi_number column to rbi_forms table
ALTER TABLE public.rbi_forms 
ADD COLUMN rbi_number TEXT UNIQUE;

-- Create table to track RBI sequences per barangay and year
CREATE TABLE public.rbi_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barangay_code TEXT NOT NULL,
  year INTEGER NOT NULL,
  last_sequence INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(barangay_code, year)
);

-- Create function to generate RBI numbers
CREATE OR REPLACE FUNCTION public.generate_rbi_number(user_barangay_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  region_code TEXT;
  province_code TEXT := '7'; -- Default province code (can be enhanced later)
  barangay_code TEXT;
  current_year INTEGER;
  next_sequence INTEGER;
  formatted_sequence TEXT;
  rbi_number TEXT;
BEGIN
  -- Get current year
  current_year := EXTRACT(YEAR FROM NOW());
  
  -- Get barangay details by name
  SELECT 
    REGEXP_REPLACE(COALESCE("REGION", 'REGION 3'), '[^0-9]', '', 'g'),
    COALESCE("Barangay Code"::TEXT, '0000')
  INTO region_code, barangay_code
  FROM public."Barangays"
  WHERE "BARANGAY" = user_barangay_name
  LIMIT 1;
  
  -- Default values if barangay not found
  IF region_code IS NULL OR region_code = '' THEN
    region_code := '3';
  END IF;
  
  IF barangay_code IS NULL OR barangay_code = '' THEN
    barangay_code := '0000';
  END IF;
  
  -- Ensure barangay_code is 4 digits
  barangay_code := LPAD(barangay_code, 4, '0');
  
  -- Get or create sequence for this barangay and year
  INSERT INTO public.rbi_sequences (barangay_code, year, last_sequence)
  VALUES (barangay_code, current_year, 1)
  ON CONFLICT (barangay_code, year) 
  DO UPDATE SET 
    last_sequence = rbi_sequences.last_sequence + 1,
    updated_at = NOW()
  RETURNING last_sequence INTO next_sequence;
  
  -- Format sequence as 7-digit number
  formatted_sequence := LPAD(next_sequence::TEXT, 7, '0');
  
  -- Construct RBI number: RBI-{REGION}-{PROVINCE}-{BARANGAY_CODE}-{SEQUENCE}
  rbi_number := 'RBI-' || region_code || '-' || province_code || '-' || barangay_code || '-' || formatted_sequence;
  
  RETURN rbi_number;
END;
$$;

-- Create trigger function to auto-generate RBI numbers
CREATE OR REPLACE FUNCTION public.set_rbi_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  user_barangay TEXT;
BEGIN
  -- Only generate RBI number for submitted forms that don't already have one
  IF NEW.status = 'submitted' AND NEW.rbi_number IS NULL THEN
    -- Extract barangay from user's profile
    SELECT barangay INTO user_barangay
    FROM public.profiles
    WHERE id = NEW.user_id;
    
    -- If no barangay in profile, try to extract from form data
    IF user_barangay IS NULL THEN
      user_barangay := COALESCE(NEW.form_data->>'address'->>'barangay', 'Unknown');
    END IF;
    
    -- Generate RBI number
    NEW.rbi_number := public.generate_rbi_number(user_barangay);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on rbi_forms table
CREATE TRIGGER trigger_set_rbi_number
  BEFORE INSERT OR UPDATE ON public.rbi_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.set_rbi_number();

-- Create index for performance
CREATE INDEX idx_rbi_forms_rbi_number ON public.rbi_forms(rbi_number);
CREATE INDEX idx_rbi_sequences_barangay_year ON public.rbi_sequences(barangay_code, year);
