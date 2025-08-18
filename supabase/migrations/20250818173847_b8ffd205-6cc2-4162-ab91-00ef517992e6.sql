-- Add secure MPIN support to profiles and verification helpers
-- 1) Columns for hashed MPIN and lockout controls
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS mpin_hash text,
  ADD COLUMN IF NOT EXISTS mpin_failed_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mpin_locked_until timestamptz,
  ADD COLUMN IF NOT EXISTS mpin_set_at timestamptz DEFAULT now();

-- Helpful index for case-insensitive email lookups during MPIN login
CREATE INDEX IF NOT EXISTS idx_profiles_lower_email ON public.profiles (lower(email));

-- 2) Function for users to set their own MPIN (hash + reset counters)
CREATE OR REPLACE FUNCTION public.set_user_mpin(mpin_text text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF mpin_text IS NULL OR length(mpin_text) < 4 OR length(mpin_text) > 12 THEN
    RAISE EXCEPTION 'Invalid MPIN length';
  END IF;

  UPDATE public.profiles
  SET 
    mpin_hash = public.hash_password(mpin_text),
    mpin_failed_attempts = 0,
    mpin_locked_until = NULL,
    mpin_set_at = now()
  WHERE id = auth.uid();
END;
$$;

-- 3) Function to verify a user's MPIN by email with lockouts
-- Returns JSON like { ok: true, user_id: '...', ... } or { ok: false, reason: 'invalid'|'locked'|'not_set'|'not_found', remaining_attempts?, locked_until? }
CREATE OR REPLACE FUNCTION public.verify_user_mpin(p_email text, p_mpin text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile RECORD;
  v_now timestamptz := now();
  v_max_attempts int := 5;
  v_lock_minutes int := 15;
  v_new_attempts int;
  v_locked_until timestamptz;
  v_ok boolean;
BEGIN
  IF p_email IS NULL OR p_mpin IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  SELECT id, mpin_hash, mpin_failed_attempts, mpin_locked_until
  INTO v_profile
  FROM public.profiles
  WHERE lower(email) = lower(p_email)
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  IF v_profile.mpin_hash IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_set');
  END IF;

  IF v_profile.mpin_locked_until IS NOT NULL AND v_profile.mpin_locked_until > v_now THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'locked', 'locked_until', v_profile.mpin_locked_until);
  END IF;

  -- Verify using existing verify_password helper (bcrypt/crypt)
  v_ok := public.verify_password(p_mpin, v_profile.mpin_hash);

  IF v_ok THEN
    UPDATE public.profiles
    SET mpin_failed_attempts = 0,
        mpin_locked_until = NULL
    WHERE id = v_profile.id;

    RETURN jsonb_build_object('ok', true, 'user_id', v_profile.id);
  ELSE
    v_new_attempts := COALESCE(v_profile.mpin_failed_attempts, 0) + 1;

    IF v_new_attempts >= v_max_attempts THEN
      v_locked_until := v_now + make_interval(mins => v_lock_minutes);
      UPDATE public.profiles
      SET mpin_failed_attempts = v_new_attempts,
          mpin_locked_until = v_locked_until
      WHERE id = v_profile.id;
      RETURN jsonb_build_object('ok', false, 'reason', 'locked', 'locked_until', v_locked_until);
    ELSE
      UPDATE public.profiles
      SET mpin_failed_attempts = v_new_attempts
      WHERE id = v_profile.id;
      RETURN jsonb_build_object('ok', false, 'reason', 'invalid', 'remaining_attempts', v_max_attempts - v_new_attempts);
    END IF;
  END IF;
END;
$$;