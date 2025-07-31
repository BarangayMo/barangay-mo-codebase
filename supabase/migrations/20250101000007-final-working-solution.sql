-- Clean up all previous attempts
DROP TRIGGER IF EXISTS trg_handle_official_approval ON public.officials;
DROP TRIGGER IF EXISTS trg_hash_password_on_approval ON public.officials;
DROP FUNCTION IF EXISTS public.handle_official_approval();
DROP FUNCTION IF EXISTS public.hash_password_on_approval();
DROP FUNCTION IF EXISTS public.approve_official_with_profile();
DROP FUNCTION IF EXISTS public.fix_approved_officials();
DROP FUNCTION IF EXISTS public.fix_specific_official();
DROP FUNCTION IF EXISTS public.fix_approved_officials_profiles();
DROP FUNCTION IF EXISTS public.fix_specific_official_profile();

-- Create a simple trigger that only handles password hashing and profile creation
CREATE OR REPLACE FUNCTION public.handle_official_approval_simple()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id UUID;
    hashed_password TEXT;
    profile_exists BOOLEAN;
BEGIN
    -- Only proceed if status changed to 'approved'
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        
        RAISE NOTICE 'Official approval triggered for ID: %', NEW.id;
        
        -- Generate a new UUID for the user
        new_user_id := gen_random_uuid();
        RAISE NOTICE 'Generated new user_id: %', new_user_id;
        
        -- Hash the original password if it exists
        IF NEW.original_password IS NOT NULL THEN
            SELECT crypt(NEW.original_password, gen_salt('bf')) INTO hashed_password;
            RAISE NOTICE 'Password hashed successfully';
            
            -- Update the password_hash field
            UPDATE public.officials 
            SET password_hash = hashed_password 
            WHERE id = NEW.id;
        END IF;
        
        -- Check if profile already exists
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE email = NEW.email) INTO profile_exists;
        
        -- Insert into profiles table (only if profile doesn't exist)
        IF NOT profile_exists THEN
            RAISE NOTICE 'Inserting into profiles table with user_id: %', new_user_id;
            
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
            
            RAISE NOTICE 'Successfully inserted into profiles table';
        ELSE
            RAISE NOTICE 'Profile already exists for this email';
        END IF;
        
        -- Clear the original password for security
        UPDATE public.officials 
        SET original_password = NULL 
        WHERE id = NEW.id;
        
        RAISE NOTICE 'Official approval process completed successfully';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER trg_handle_official_approval_simple
    AFTER UPDATE ON public.officials
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_official_approval_simple();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_official_approval_simple() TO authenticated;

-- Create a function to manually create profiles for existing approved officials
CREATE OR REPLACE FUNCTION public.create_profiles_for_approved_officials()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    official_record RECORD;
    new_user_id UUID;
    hashed_password TEXT;
    profile_exists BOOLEAN;
    created_count INTEGER := 0;
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
        
        created_count := created_count + 1;
    END LOOP;
    
    RETURN 'Created profiles for ' || created_count || ' approved officials';
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.create_profiles_for_approved_officials() TO authenticated; 