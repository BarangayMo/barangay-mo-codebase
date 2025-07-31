-- Function to handle official approval and create profile
CREATE OR REPLACE FUNCTION public.handle_official_approval()
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
        
        -- Generate a new UUID for the user if not exists
        IF NEW.user_id IS NULL THEN
            new_user_id := gen_random_uuid();
            
            -- Update the official record with the new user_id
            UPDATE public.officials 
            SET user_id = new_user_id 
            WHERE id = NEW.id;
        ELSE
            new_user_id := NEW.user_id;
        END IF;
        
        -- Hash the original password if it exists
        IF NEW.original_password IS NOT NULL THEN
            SELECT crypt(NEW.original_password, gen_salt('bf')) INTO hashed_password;
            
            -- Update the password_hash field
            UPDATE public.officials 
            SET password_hash = hashed_password 
            WHERE id = NEW.id;
        END IF;
        
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
        ) ON CONFLICT (id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            middle_name = EXCLUDED.middle_name,
            suffix = EXCLUDED.suffix,
            email = EXCLUDED.email,
            phone_number = EXCLUDED.phone_number,
            landline_number = EXCLUDED.landline_number,
            barangay = EXCLUDED.barangay,
            municipality = EXCLUDED.municipality,
            province = EXCLUDED.province,
            region = EXCLUDED.region,
            role = EXCLUDED.role,
            is_approved = EXCLUDED.is_approved,
            updated_at = now();
        
        -- Clear the original password for security
        UPDATE public.officials 
        SET original_password = NULL 
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger to handle official approval
DROP TRIGGER IF EXISTS trg_handle_official_approval ON public.officials;
CREATE TRIGGER trg_handle_official_approval
    AFTER UPDATE ON public.officials
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_official_approval();

-- Function to verify official password for login
CREATE OR REPLACE FUNCTION public.verify_official_password(official_id UUID, password_text TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stored_hash TEXT;
BEGIN
    SELECT password_hash INTO stored_hash 
    FROM public.officials 
    WHERE id = official_id;
    
    IF stored_hash IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN crypt(password_text, stored_hash) = stored_hash;
END;
$$;

-- Function to create auth user for approved official
CREATE OR REPLACE FUNCTION public.create_auth_user_for_official(official_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    official_record RECORD;
    new_user_id UUID;
BEGIN
    -- Get the official record
    SELECT * INTO official_record 
    FROM public.officials 
    WHERE id = official_id AND status = 'approved';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Official not found or not approved';
    END IF;
    
    -- Use the existing user_id or generate new one
    new_user_id := COALESCE(official_record.user_id, gen_random_uuid());
    
    -- Update the official record with user_id if it was generated
    IF official_record.user_id IS NULL THEN
        UPDATE public.officials 
        SET user_id = new_user_id 
        WHERE id = official_id;
    END IF;
    
    RETURN new_user_id;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_official_approval() TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_official_password(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_auth_user_for_official(UUID) TO authenticated; 