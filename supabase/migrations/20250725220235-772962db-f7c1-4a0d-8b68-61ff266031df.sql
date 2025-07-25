-- Add password field to officials table for secure password storage
ALTER TABLE public.officials 
ADD COLUMN password_hash TEXT;

-- Create function to hash passwords
CREATE OR REPLACE FUNCTION public.hash_password(password_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use crypt to hash the password with bcrypt
  RETURN crypt(password_text, gen_salt('bf'));
END;
$$;

-- Create function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(password_text TEXT, password_hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify password using crypt
  RETURN password_hash = crypt(password_text, password_hash);
END;
$$;

-- Update the approve_official function to create Supabase Auth user when approved
CREATE OR REPLACE FUNCTION public.approve_official(official_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
    UPDATE public.officials 
    SET 
        status = 'approved',
        is_approved = true,
        approved_by = auth.uid(),
        approved_at = now(),
        updated_at = now()
    WHERE id = official_id;
    
    -- Note: The actual Supabase Auth user creation will be handled by an Edge Function
    -- since we need to use the Admin API for that operation
END;
$$;