-- Function to handle official approval and create auth user
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
        
        -- Hash the original password if it exists
        IF NEW.original_password IS NOT NULL THEN
            SELECT crypt(NEW.original_password, gen_salt('bf')) INTO hashed_password;
            
            -- Update the password_hash field
            UPDATE public.officials 
            SET password_hash = hashed_password 
            WHERE id = NEW.id;
        END IF;
        
        -- Create auth user if not exists
        IF NEW.user_id IS NULL THEN
            -- Insert into auth.users
            INSERT INTO auth.users (
                email,
                encrypted_password,
                email_confirmed_at,
                created_at,
                updated_at,
                raw_user_meta_data
            ) VALUES (
                NEW.email,
                hashed_password,
                now(),
                now(),
                now(),
                jsonb_build_object(
                    'first_name', NEW.first_name,
                    'last_name', NEW.last_name,
                    'middle_name', COALESCE(NEW.middle_name, ''),
                    'suffix', COALESCE(NEW.suffix, ''),
                    'phone_number', NEW.phone_number,
                    'landline_number', COALESCE(NEW.landline_number, ''),
                    'barangay', NEW.barangay,
                    'municipality', NEW.municipality,
                    'province', NEW.province,
                    'region', NEW.region,
                    'role', 'official',
                    'position', NEW.position
                )
            ) RETURNING id INTO new_user_id;
            
            -- Update the official record with the new user_id
            UPDATE public.officials 
            SET user_id = new_user_id 
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
            COALESCE(NEW.user_id, new_user_id),
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

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_official_approval() TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_official_password(UUID, TEXT) TO authenticated; 