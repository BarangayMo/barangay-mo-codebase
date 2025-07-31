-- Function to fix approved officials that don't have user_id or profiles
CREATE OR REPLACE FUNCTION public.fix_approved_officials()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    official_record RECORD;
    new_user_id UUID;
    hashed_password TEXT;
    fixed_count INTEGER := 0;
BEGIN
    -- Loop through all approved officials without user_id
    FOR official_record IN 
        SELECT * FROM public.officials 
        WHERE status = 'approved' AND user_id IS NULL
    LOOP
        -- Generate a new UUID for the user
        new_user_id := gen_random_uuid();
        
        -- Hash the original password if it exists
        IF official_record.original_password IS NOT NULL THEN
            SELECT crypt(official_record.original_password, gen_salt('bf')) INTO hashed_password;
        END IF;
        
        -- Update the official record
        UPDATE public.officials 
        SET 
            user_id = new_user_id,
            password_hash = hashed_password,
            original_password = NULL,
            updated_at = now()
        WHERE id = official_record.id;
        
        -- Insert into profiles table
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
        
        fixed_count := fixed_count + 1;
    END LOOP;
    
    RETURN 'Fixed ' || fixed_count || ' approved officials';
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.fix_approved_officials() TO authenticated;

-- Also create a function to fix a specific official
CREATE OR REPLACE FUNCTION public.fix_specific_official(official_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    official_record RECORD;
    new_user_id UUID;
    hashed_password TEXT;
BEGIN
    -- Get the official record
    SELECT * INTO official_record 
    FROM public.officials 
    WHERE id = official_id;
    
    IF NOT FOUND THEN
        RETURN 'Official not found';
    END IF;
    
    IF official_record.status != 'approved' THEN
        RETURN 'Official is not approved';
    END IF;
    
    IF official_record.user_id IS NOT NULL THEN
        RETURN 'Official already has user_id: ' || official_record.user_id;
    END IF;
    
    -- Generate a new UUID for the user
    new_user_id := gen_random_uuid();
    
    -- Hash the original password if it exists
    IF official_record.original_password IS NOT NULL THEN
        SELECT crypt(official_record.original_password, gen_salt('bf')) INTO hashed_password;
    END IF;
    
    -- Update the official record
    UPDATE public.officials 
    SET 
        user_id = new_user_id,
        password_hash = hashed_password,
        original_password = NULL,
        updated_at = now()
    WHERE id = official_id;
    
    -- Insert into profiles table
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
    
    RETURN 'Fixed official with user_id: ' || new_user_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.fix_specific_official(UUID) TO authenticated; 