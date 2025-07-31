-- Create a direct function that handles everything without relying on triggers
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
BEGIN
    -- Get the official record
    SELECT * INTO official_record 
    FROM public.officials 
    WHERE id = official_id;
    
    IF NOT FOUND THEN
        RETURN 'Official not found';
    END IF;
    
    IF official_record.status = 'approved' THEN
        RETURN 'Official is already approved';
    END IF;
    
    -- Generate a new UUID for the user
    new_user_id := gen_random_uuid();
    
    -- Hash the original password if it exists
    IF official_record.original_password IS NOT NULL THEN
        SELECT crypt(official_record.original_password, gen_salt('bf')) INTO hashed_password;
    END IF;
    
    -- Check if profile already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE email = official_record.email) INTO profile_exists;
    
    -- Update the official record
    UPDATE public.officials 
    SET 
        status = 'approved',
        is_approved = true,
        password_hash = hashed_password,
        original_password = NULL,
        approved_at = now(),
        updated_at = now()
    WHERE id = official_id;
    
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
    END IF;
    
    RETURN 'Official approved successfully with profile user_id: ' || new_user_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.approve_official_direct(UUID) TO authenticated;

-- Create a function to fix existing approved officials
CREATE OR REPLACE FUNCTION public.fix_existing_approved_officials()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    official_record RECORD;
    new_user_id UUID;
    hashed_password TEXT;
    profile_exists BOOLEAN;
    fixed_count INTEGER := 0;
BEGIN
    -- Loop through all approved officials without profiles
    FOR official_record IN 
        SELECT o.* FROM public.officials o
        LEFT JOIN public.profiles p ON p.email = o.email
        WHERE o.status = 'approved' AND p.id IS NULL
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
GRANT EXECUTE ON FUNCTION public.fix_existing_approved_officials() TO authenticated; 