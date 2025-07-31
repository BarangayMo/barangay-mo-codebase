-- Drop our conflicting trigger
DROP TRIGGER IF EXISTS trg_handle_official_approval ON public.officials;

-- Update the existing hash_password_on_approval function to also handle profile creation
CREATE OR REPLACE FUNCTION public.hash_password_on_approval()
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
        
        RAISE NOTICE 'Official approval triggered for ID: %', NEW.id;
        
        -- Generate a new UUID for the user if not exists
        IF NEW.user_id IS NULL THEN
            new_user_id := gen_random_uuid();
            RAISE NOTICE 'Generated new user_id: %', new_user_id;
            
            -- Update the official record with the new user_id
            UPDATE public.officials 
            SET user_id = new_user_id 
            WHERE id = NEW.id;
        ELSE
            new_user_id := NEW.user_id;
            RAISE NOTICE 'Using existing user_id: %', new_user_id;
        END IF;
        
        -- Hash the original password if it exists
        IF NEW.original_password IS NOT NULL THEN
            SELECT crypt(NEW.original_password, gen_salt('bf')) INTO hashed_password;
            RAISE NOTICE 'Password hashed successfully';
            
            -- Update the password_hash field
            UPDATE public.officials 
            SET password_hash = hashed_password 
            WHERE id = NEW.id;
        END IF;
        
        -- Insert into profiles table
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
        
        -- Clear the original password for security
        UPDATE public.officials 
        SET original_password = NULL 
        WHERE id = NEW.id;
        
        RAISE NOTICE 'Official approval process completed successfully';
    END IF;
    
    RETURN NEW;
END;
$$;

-- The existing trigger trg_hash_password_on_approval should now work with our updated function
-- No need to create a new trigger since the existing one will call our updated function

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.hash_password_on_approval() TO authenticated; 