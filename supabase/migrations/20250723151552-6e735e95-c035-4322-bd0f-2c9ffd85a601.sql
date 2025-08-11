-- Fix the ambiguous barangay_code reference in generate_rbi_number function
CREATE OR REPLACE FUNCTION public.generate_rbi_number(user_barangay_name text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  region_code TEXT;
  province_code TEXT := '7'; -- Default province code (can be enhanced later)
  v_barangay_code TEXT; -- Renamed from barangay_code to avoid ambiguity
  current_year INTEGER;
  next_sequence INTEGER;
  formatted_sequence TEXT;
  rbi_number TEXT;
BEGIN
  -- Get current year
  current_year := EXTRACT(YEAR FROM NOW());
  
  -- Get barangay details by name with explicit table qualification
  SELECT 
    REGEXP_REPLACE(COALESCE(b."REGION", 'REGION 3'), '[^0-9]', '', 'g'),
    COALESCE(b."Barangay Code"::TEXT, '0000')
  INTO region_code, v_barangay_code
  FROM public."Barangays" b
  WHERE b."BARANGAY" = user_barangay_name
  LIMIT 1;
  
  -- Default values if barangay not found
  IF region_code IS NULL OR region_code = '' THEN
    region_code := '3';
  END IF;
  
  IF v_barangay_code IS NULL OR v_barangay_code = '' THEN
    v_barangay_code := '0000';
  END IF;
  
  -- Ensure v_barangay_code is 4 digits
  v_barangay_code := LPAD(v_barangay_code, 4, '0');
  
  -- Get or create sequence for this barangay and year with explicit column qualification
  INSERT INTO public.rbi_sequences (barangay_code, year, last_sequence)
  VALUES (v_barangay_code, current_year, 1)
  ON CONFLICT (barangay_code, year) 
  DO UPDATE SET 
    last_sequence = rbi_sequences.last_sequence + 1,
    updated_at = NOW()
  RETURNING last_sequence INTO next_sequence;
  
  -- Format sequence as 7-digit number
  formatted_sequence := LPAD(next_sequence::TEXT, 7, '0');
  
  -- Construct RBI number: RBI-{REGION}-{PROVINCE}-{BARANGAY_CODE}-{SEQUENCE}
  rbi_number := 'RBI-' || region_code || '-' || province_code || '-' || v_barangay_code || '-' || formatted_sequence;
  
  RETURN rbi_number;
END;
$function$;