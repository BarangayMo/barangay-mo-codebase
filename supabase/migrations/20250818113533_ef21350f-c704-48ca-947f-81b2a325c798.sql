-- Create function to get region table name based on region
CREATE OR REPLACE FUNCTION public.get_region_table_name(region_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Map region names to table names
  CASE 
    WHEN region_name ILIKE '%REGION 1%' OR region_name ILIKE '%REGION I%' THEN
      RETURN 'REGION 1';
    WHEN region_name ILIKE '%REGION 2%' OR region_name ILIKE '%REGION II%' THEN
      RETURN 'REGION 2';
    WHEN region_name ILIKE '%REGION 3%' OR region_name ILIKE '%REGION III%' THEN
      RETURN 'REGION 3';
    WHEN region_name ILIKE '%REGION 4A%' OR region_name ILIKE '%REGION IVA%' THEN
      RETURN 'REGION 4A';
    WHEN region_name ILIKE '%REGION 4B%' OR region_name ILIKE '%REGION IVB%' THEN
      RETURN 'REGION 4B';
    WHEN region_name ILIKE '%REGION 5%' OR region_name ILIKE '%REGION V%' THEN
      RETURN 'REGION 5';
    WHEN region_name ILIKE '%REGION 6%' OR region_name ILIKE '%REGION VI%' THEN
      RETURN 'REGION 6';
    WHEN region_name ILIKE '%REGION 7%' OR region_name ILIKE '%REGION VII%' THEN
      RETURN 'REGION 7';
    WHEN region_name ILIKE '%REGION 8%' OR region_name ILIKE '%REGION VIII%' THEN
      RETURN 'REGION 8';
    WHEN region_name ILIKE '%REGION 9%' OR region_name ILIKE '%REGION IX%' THEN
      RETURN 'REGION 9';
    WHEN region_name ILIKE '%REGION 10%' OR region_name ILIKE '%REGION X%' THEN
      RETURN 'REGION 10';
    WHEN region_name ILIKE '%REGION 11%' OR region_name ILIKE '%REGION XI%' THEN
      RETURN 'REGION 11';
    WHEN region_name ILIKE '%REGION 12%' OR region_name ILIKE '%REGION XII%' THEN
      RETURN 'REGION 12';
    WHEN region_name ILIKE '%REGION 13%' OR region_name ILIKE '%REGION XIII%' THEN
      RETURN 'REGION 13';
    WHEN region_name ILIKE '%NCR%' OR region_name ILIKE '%NATIONAL CAPITAL%' THEN
      RETURN 'NCR';
    WHEN region_name ILIKE '%CAR%' OR region_name ILIKE '%CORDILLERA%' THEN
      RETURN 'CAR';
    WHEN region_name ILIKE '%BARMM%' OR region_name ILIKE '%BANGSAMORO%' THEN
      RETURN 'BARMM';
    ELSE
      RETURN 'REGION 3'; -- Default fallback
  END CASE;
END;
$$;

-- Create function to create barangay entry from region data
CREATE OR REPLACE FUNCTION public.create_barangay_from_region_data(
  barangay_name text,
  municipality_name text,
  province_name text,
  region_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_barangay_id uuid;
  region_data record;
  region_table_name text;
BEGIN
  -- Generate random UUID for the new barangay
  new_barangay_id := gen_random_uuid();
  
  -- Get the appropriate region table name
  region_table_name := public.get_region_table_name(region_name);
  
  -- Try to find matching data in the region table
  -- We'll use dynamic SQL to query the appropriate region table
  EXECUTE format('
    SELECT 
      "FIRSTNAME",
      "LASTNAME", 
      "MIDDLENAME",
      "SUFFIX",
      "POSITION",
      "BARANGAY HALL TELNO",
      "TERM"
    FROM %I 
    WHERE "BARANGAY" ILIKE %L 
    AND "CITY/MUNICIPALITY" ILIKE %L 
    AND "PROVINCE" ILIKE %L
    LIMIT 1',
    region_table_name,
    '%' || barangay_name || '%',
    '%' || municipality_name || '%', 
    '%' || province_name || '%'
  ) INTO region_data;
  
  -- Insert new barangay with data from region table (if found) or defaults
  INSERT INTO public."Barangays" (
    "ID",
    "BARANGAY",
    "CITY/MUNICIPALITY", 
    "PROVINCE",
    "REGION",
    "FIRSTNAME",
    "LASTNAME",
    "MIDDLENAME", 
    "SUFFIX",
    "Telephone No",
    "Mobile Number",
    "Email Address",
    "Website",
    "Facebook",
    "Population",
    "Foundation Date",
    "Land Area",
    "Logo",
    "Division",
    "No of Divisions",
    "Fire Department Phone",
    "Local Police Contact", 
    "VAWC Hotline No",
    "BPAT Phone",
    "Created",
    "Updated"
  ) VALUES (
    new_barangay_id,
    barangay_name,
    municipality_name,
    province_name, 
    region_name,
    COALESCE(region_data."FIRSTNAME", ''),
    COALESCE(region_data."LASTNAME", ''),
    COALESCE(region_data."MIDDLENAME", ''),
    COALESCE(region_data."SUFFIX", ''),
    COALESCE(region_data."BARANGAY HALL TELNO", ''),
    '', -- Mobile Number - empty by default
    '', -- Email Address - empty by default
    '', -- Website - empty by default  
    '', -- Facebook - empty by default
    '', -- Population - empty by default
    '', -- Foundation Date - empty by default
    '', -- Land Area - empty by default
    '', -- Logo - empty by default
    '', -- Division - empty by default
    '', -- No of Divisions - empty by default
    '', -- Fire Department Phone - empty by default
    '', -- Local Police Contact - empty by default
    '', -- VAWC Hotline No - empty by default
    '', -- BPAT Phone - empty by default
    now(),
    now()
  );
  
  RETURN new_barangay_id;
END;
$$;