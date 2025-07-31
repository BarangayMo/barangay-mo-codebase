-- Drop all conflicting triggers and functions
DROP TRIGGER IF EXISTS trg_handle_official_approval ON public.officials;
DROP TRIGGER IF EXISTS trg_hash_password_on_approval ON public.officials;
DROP FUNCTION IF EXISTS public.handle_official_approval();
DROP FUNCTION IF EXISTS public.hash_password_on_approval();

-- Create a simple function that handles the entire approval process
CREATE OR REPLACE FUNCTION public.approve_official_with_profile(official_id UUID)
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
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = official_record.user_id) INTO profile_exists;
    
    -- Update the official record
    UPDATE public.officials 
    SET 
        status = 'approved',
        is_approved = true,
        user_id = new_user_id,
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
    
    RETURN 'Official approved successfully with user_id: ' || new_user_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.approve_official_with_profile(UUID) TO authenticated;

-- Create a simple trigger for future approvals (optional)
CREATE OR REPLACE FUNCTION public.handle_official_approval_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id UUID;
    hashed_password TEXT;
BEGIN
    -- Only proceed if status changed to 'approved'
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        
        -- Generate a new UUID for the user
        new_user_id := gen_random_uuid();
        
        -- Hash the original password if it exists
        IF NEW.original_password IS NOT NULL THEN
            SELECT crypt(NEW.original_password, gen_salt('bf')) INTO hashed_password;
        END IF;
        
        -- Update the official record with the new user_id
        UPDATE public.officials 
        SET user_id = new_user_id,
            password_hash = hashed_password,
            original_password = NULL
        WHERE id = NEW.id;
        
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
            NEW.first_name,
            NEW.last_name,
            COALESCE(NEW.middle_name, ''),
            COALESCE(NEW.suffix, ''),
            NEW.email,
            NEW.phone_number,
            COALESCE(NEW.landline_number, ''),
            NEW.barangay,
            NEW.municipality,
            NEW.province,
            NEW.region,
            'official'::public.user_role,
            true,
            now(),
            now()
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER trg_handle_official_approval
    AFTER UPDATE ON public.officials
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_official_approval_trigger();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_official_approval_trigger() TO authenticated; 
