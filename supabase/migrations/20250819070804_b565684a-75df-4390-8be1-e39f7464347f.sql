-- Add MPIN columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS mpin_hash TEXT,
ADD COLUMN IF NOT EXISTS mpin_set_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS mpin_failed_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS mpin_locked_until TIMESTAMP WITH TIME ZONE;

-- Create function to verify MPIN
CREATE OR REPLACE FUNCTION public.verify_user_mpin(p_email text, p_mpin text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id UUID;
  v_profile RECORD;
  v_attempts INTEGER;
  v_locked_until TIMESTAMPTZ;
  v_remaining INTEGER;
  v_lock_threshold INTEGER := 5;      -- max attempts before lock
  v_lock_minutes INTEGER := 15;       -- lock duration in minutes
BEGIN
  -- Basic validation
  IF p_email IS NULL OR p_mpin IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_request');
  END IF;

  -- Find auth user by email (case-insensitive)
  SELECT u.id
    INTO v_user_id
  FROM auth.users u
  WHERE lower(u.email) = lower(p_email)
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  -- Load profile
  SELECT 
    p.mpin_hash,
    COALESCE(p.mpin_failed_attempts, 0) AS mpin_failed_attempts,
    p.mpin_locked_until
  INTO v_profile
  FROM public.profiles p
  WHERE p.id = v_user_id;

  IF v_profile IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  -- MPIN not set
  IF v_profile.mpin_hash IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_set');
  END IF;

  -- Check lock status
  IF v_profile.mpin_locked_until IS NOT NULL AND v_profile.mpin_locked_until > now() THEN
    RETURN jsonb_build_object(
      'ok', false,
      'reason', 'locked',
      'locked_until', v_profile.mpin_locked_until
    );
  END IF;

  -- Verify MPIN using pgcrypto in extensions schema
  IF extensions.crypt(p_mpin, v_profile.mpin_hash) = v_profile.mpin_hash THEN
    UPDATE public.profiles
    SET mpin_failed_attempts = 0,
        mpin_locked_until = NULL
    WHERE id = v_user_id;

    RETURN jsonb_build_object('ok', true, 'user_id', v_user_id);
  ELSE
    v_attempts := v_profile.mpin_failed_attempts + 1;

    IF v_attempts >= v_lock_threshold THEN
      v_locked_until := now() + make_interval(mins => v_lock_minutes);
      UPDATE public.profiles
      SET mpin_failed_attempts = v_attempts,
          mpin_locked_until = v_locked_until
      WHERE id = v_user_id;

      RETURN jsonb_build_object(
        'ok', false,
        'reason', 'locked',
        'remaining_attempts', 0,
        'locked_until', v_locked_until
      );
    ELSE
      UPDATE public.profiles
      SET mpin_failed_attempts = v_attempts
      WHERE id = v_user_id;

      v_remaining := v_lock_threshold - v_attempts;
      RETURN jsonb_build_object(
        'ok', false,
        'reason', 'invalid',
        'remaining_attempts', v_remaining
      );
    END IF;
  END IF;
END;
$function$;

-- Create function to set MPIN
CREATE OR REPLACE FUNCTION public.set_user_mpin(mpin_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  _user_id UUID;
BEGIN
  -- Get authenticated user ID
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF mpin_text IS NULL OR length(mpin_text) < 4 OR length(mpin_text) > 12 THEN
    RAISE EXCEPTION 'Invalid MPIN length';
  END IF;

  -- Use extensions.crypt directly
  UPDATE public.profiles
  SET 
    mpin_hash = extensions.crypt(mpin_text, extensions.gen_salt('bf')),
    mpin_failed_attempts = 0,
    mpin_locked_until = NULL,
    mpin_set_at = now()
  WHERE id = _user_id;

  RETURN true;
END;
$function$;