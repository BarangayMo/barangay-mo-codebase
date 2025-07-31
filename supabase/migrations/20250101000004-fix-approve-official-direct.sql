-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.approve_official_direct(UUID);

-- Create a corrected function that handles everything without relying on triggers
CREATE OR REPLACE FUNCTION public.approve_official_direct(official_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    official_record RECORD;
    new_user_id UUID;
    hashed_password TEXT;
    profile_exists BOOLEAN;
    update_count INTEGER;
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
    
    IF official_record.status = 'approved' THEN
        RETURN 'Info: Official is already approved';
    END IF;
    
    -- Generate a new UUID for the user
    new_user_id := gen_random_uuid();
    
    -- Hash the original password if it exists
    IF official_record.original_password IS NOT NULL AND official_record.original_password != '' THEN
        SELECT crypt(official_record.original_password, gen_salt('bf')) INTO hashed_password;
    ELSE
        hashed_password := NULL;
    END IF;
    
    -- Check if profile already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE email = official_record.email) INTO profile_exists;
    
    -- Update the official record with explicit WHERE clause
    UPDATE public.officials 
    SET 
        status = 'approved',
        is_approved = true,
        password_hash = hashed_password,
        original_password = NULL,
        approved_at = now(),
        updated_at = now()
    WHERE id = official_id;
    
    -- Get the number of rows affected
    GET DIAGNOSTICS update_count = ROW_COUNT;
    
    IF update_count = 0 THEN
        RETURN 'Error: Failed to update official record';
    END IF;
    
    -- Insert into profiles table (only if profile doesn't exist)
    IF NOT profile_exists THEN
        INSERT INTO public.profiles (
            id,
            first_name,
            last_name,
            middle_name,
            suffix,
            email,
            phone_number,
            landline_number,
            barangay,
            municipality,
            province,
            region,
            role,
            is_approved,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            official_record.first_name,
            official_record.last_name,
            COALESCE(official_record.middle_name, ''),
            COALESCE(official_record.suffix, ''),
            official_record.email,
            official_record.phone_number,
            COALESCE(official_record.landline_number, ''),
            official_record.barangay,
            official_record.municipality,
            official_record.province,
            official_record.region,
            'official'::public.user_role,
            true,
            now(),
            now()
        );
        
        RETURN 'Success: Official approved successfully with profile user_id: ' || new_user_id;
    ELSE
        RETURN 'Success: Official approved successfully (profile already exists)';
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.approve_official_direct(UUID) TO authenticated; 