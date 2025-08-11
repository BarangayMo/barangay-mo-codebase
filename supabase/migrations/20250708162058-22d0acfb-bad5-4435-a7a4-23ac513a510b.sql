
-- Drop the placeholder function and create the real implementation
DROP FUNCTION IF EXISTS get_officials_by_region(TEXT, TEXT, TEXT, TEXT);

-- Create function to get officials by region with proper implementation
CREATE OR REPLACE FUNCTION get_officials_by_region(
  region_name TEXT,
  barangay_name TEXT,
  province_name TEXT,
  municipality_name TEXT
)
RETURNS TABLE (
  POSITION TEXT,
  FIRSTNAME TEXT,
  MIDDLENAME TEXT,
  LASTNAME TEXT,
  SUFFIX TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Handle different region tables dynamically
  CASE region_name
    WHEN 'REGION 1' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 1" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 2' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 2" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 3' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 3" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 4A' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 4A" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 4B' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 4B" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 5' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 5" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 6' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 6" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 7' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 7" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 8' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 8" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 9' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 9" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 10' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 10" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 11' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 11" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 12' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 12" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'REGION 13' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."REGION 13" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'NCR' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."NCR" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'CAR' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."CAR" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    WHEN 'BARMM' THEN
      RETURN QUERY
      SELECT r.POSITION, r.FIRSTNAME, r.MIDDLENAME, r.LASTNAME, r.SUFFIX
      FROM public."BARMM" r
      WHERE r.BARANGAY = barangay_name 
        AND r.PROVINCE = province_name 
        AND r."CITY/MUNICIPALITY" = municipality_name;
    
    ELSE
      -- Return empty result for unknown regions
      RETURN;
  END CASE;
END;
$$;
