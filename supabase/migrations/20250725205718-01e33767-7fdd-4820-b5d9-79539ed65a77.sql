-- Fix the search path for the approve_official function
DROP FUNCTION IF EXISTS public.approve_official(UUID);

CREATE OR REPLACE FUNCTION public.approve_official(official_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    official_record RECORD;
    new_user_id UUID;
BEGIN
    -- Get the official record
    SELECT * INTO official_record 
    FROM public.officials 
    WHERE id = official_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Official not found';
    END IF;
    
    -- Check if user has permission (super-admin)
    IF NOT EXISTS (
        SELECT 1 
        FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'superadmin'
    ) THEN
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;
    
    -- Create auth user if not exists
    IF official_record.user_id IS NULL THEN
        -- Generate a temporary password (they'll need to reset it)
        INSERT INTO auth.users (
            email,
            raw_user_meta_data,
            email_confirmed_at,
            created_at,
            updated_at
        ) VALUES (
            official_record.email,
            jsonb_build_object(
                'first_name', official_record.first_name,
                'last_name', official_record.last_name,
                'middle_name', official_record.middle_name,
                'suffix', official_record.suffix,
                'phone_number', official_record.phone_number,
                'landline_number', official_record.landline_number,
                'barangay', official_record.barangay,
                'municipality', official_record.municipality,
                'province', official_record.province,
                'region', official_record.region,
                'role', 'official'
            ),
            now(),
            now(),
            now()
        ) RETURNING id INTO new_user_id;
        
        -- Update the official record with the new user_id
        UPDATE public.officials 
        SET user_id = new_user_id 
        WHERE id = official_id;
    END IF;
    
    -- Update official status
    UPDATE public.officials 
    SET 
        status = 'approved',
        is_approved = true,
        approved_by = auth.uid(),
        approved_at = now(),
        updated_at = now()
    WHERE id = official_id;
END;
$$;