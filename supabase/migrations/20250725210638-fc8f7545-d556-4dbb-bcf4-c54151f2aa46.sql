-- Test and fix the approve_official function - the auth.users insertion won't work as intended
-- Instead we need to create a different approach since we can't directly insert into auth.users

-- First, let's create a safer version that just updates the officials table
-- The actual user creation would need to be handled differently

DROP FUNCTION IF EXISTS public.approve_official(UUID);

CREATE OR REPLACE FUNCTION public.approve_official(official_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    official_record RECORD;
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
    
    -- Update official status to approved
    -- Note: For now, we'll just mark as approved
    -- The actual user account creation would need to be handled via a separate process
    -- or the user would need to complete registration after approval
    UPDATE public.officials 
    SET 
        status = 'approved',
        is_approved = true,
        approved_by = auth.uid(),
        approved_at = now(),
        updated_at = now()
    WHERE id = official_id;
    
    -- TODO: Send notification email to the official about approval
    -- This would typically be done via an edge function or external service
    
END;
$$;