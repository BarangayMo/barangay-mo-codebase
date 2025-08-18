-- Fix: use extensions.crypt to verify MPIN (pgcrypto lives in extensions schema on Supabase)
CREATE OR REPLACE FUNCTION public.verify_user_mpin(p_email text, p_mpin text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_profile RECORD;
  v_attempts integer;
  v_locked_until timestamptz;
  v_remaining integer;
  v_lock_threshold integer := 5;      -- max attempts before lock
  v_lock_minutes integer := 15;       -- lock duration in minutes
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
$$;

GRANT EXECUTE ON FUNCTION public.verify_user_mpin(text, text) TO anon, authenticated, service_role;