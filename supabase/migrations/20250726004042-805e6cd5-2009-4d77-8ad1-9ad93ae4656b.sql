-- Add a new column to store the plain text password temporarily for account creation
-- This will only be used during the approval process and then cleared
ALTER TABLE public.officials ADD COLUMN original_password TEXT;

-- Create a function to verify if a password matches the stored hash
CREATE OR REPLACE FUNCTION public.verify_official_password(official_id uuid, password_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stored_hash text;
BEGIN
    SELECT password_hash INTO stored_hash 
    FROM public.officials 
    WHERE id = official_id;
    
    IF stored_hash IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN public.verify_password(password_text, stored_hash);
END;
$$;