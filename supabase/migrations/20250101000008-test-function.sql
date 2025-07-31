-- Test function to verify the database connection and function creation
CREATE OR REPLACE FUNCTION public.test_approve_function()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN 'Test function works correctly';
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.test_approve_function() TO authenticated;

-- Also create a simple version of the approve function for testing
CREATE OR REPLACE FUNCTION public.approve_official_simple(official_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    official_record RECORD;
BEGIN
    -- Validate input
    IF official_id IS NULL THEN
        RETURN 'Error: official_id cannot be null';
    END IF;

    -- Get the official record
    SELECT * INTO official_record 
    FROM public.officials 
    WHERE id = official_id;
    
    IF NOT FOUND THEN
        RETURN 'Error: Official not found with id ' || official_id;
    END IF;
    
    -- Simple update with explicit WHERE clause
    UPDATE public.officials 
    SET 
        status = 'approved',
        is_approved = true,
        updated_at = now()
    WHERE id = official_id;
    
    RETURN 'Success: Official approved successfully';
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.approve_official_simple(UUID) TO authenticated; 