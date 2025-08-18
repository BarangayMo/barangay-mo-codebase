-- Create function to hash MPIN
CREATE OR REPLACE FUNCTION public.hash_mpin(mpin_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Use crypt to hash the MPIN with bcrypt
  RETURN crypt(mpin_text, gen_salt('bf'));
END;
$$;

-- Create function to verify MPIN
CREATE OR REPLACE FUNCTION public.verify_mpin(mpin_text text, mpin_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify MPIN using crypt
  RETURN mpin_hash = crypt(mpin_text, mpin_hash);
END;
$$;

-- Create function to update user MPIN
CREATE OR REPLACE FUNCTION public.update_user_mpin(user_id uuid, new_mpin text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow users to update their own MPIN
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  -- Hash and update the MPIN
  UPDATE public.profiles 
  SET mpin = public.hash_mpin(new_mpin), updated_at = now()
  WHERE id = user_id;
END;
$$;

-- Create function to verify user MPIN
CREATE OR REPLACE FUNCTION public.verify_user_mpin(user_email text, mpin_input text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
  is_valid boolean;
BEGIN
  -- Get user by email
  SELECT id, mpin, role INTO user_record
  FROM public.profiles
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RETURN json_build_object('valid', false, 'error', 'User not found');
  END IF;
  
  IF user_record.mpin IS NULL THEN
    RETURN json_build_object('valid', false, 'error', 'MPIN not set');
  END IF;
  
  -- Verify MPIN
  is_valid := public.verify_mpin(mpin_input, user_record.mpin);
  
  IF is_valid THEN
    RETURN json_build_object(
      'valid', true,
      'user_id', user_record.id,
      'role', user_record.role
    );
  ELSE
    RETURN json_build_object('valid', false, 'error', 'Invalid MPIN');
  END IF;
END;
$$;