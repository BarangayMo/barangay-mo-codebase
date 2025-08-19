-- Create a function to get official data by position and barangay from region tables
CREATE OR REPLACE FUNCTION public.get_official_by_position_and_barangay(
  region_name text,
  barangay_name text,
  position_name text
)
RETURNS TABLE(
  firstname text,
  lastname text,
  middlename text,
  suffix text,
  phone text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  region_table_name text;
  sql_query text;
BEGIN
  -- Get the region table name
  region_table_name := public.get_region_table_name(region_name);
  
  -- Build dynamic query
  sql_query := format('
    SELECT 
      "FIRSTNAME"::text as firstname,
      "LASTNAME"::text as lastname,
      "MIDDLENAME"::text as middlename,
      "SUFFIX"::text as suffix,
      "BARANGAY HALL TELNO"::text as phone
    FROM %I 
    WHERE "BARANGAY" ILIKE $1 
    AND "POSITION" ILIKE $2
    LIMIT 1',
    region_table_name
  );
  
  -- Execute the query
  RETURN QUERY EXECUTE sql_query 
  USING '%' || barangay_name || '%', '%' || position_name || '%';
END;
$$;