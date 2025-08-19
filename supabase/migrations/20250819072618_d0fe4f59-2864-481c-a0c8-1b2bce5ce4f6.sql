-- Ensure MPIN can be set even if profile row is missing
CREATE OR REPLACE FUNCTION public.set_user_mpin(mpin_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  _user_id uuid;
  _email text;
  _updated int;
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Require exactly 4 digits for MPIN
  IF mpin_text IS NULL OR length(mpin_text) <> 4 OR mpin_text !~ '^[0-9]{4}$' THEN
    RAISE EXCEPTION 'Invalid MPIN. Must be 4 digits.';
  END IF;

  -- Get email for potential profile bootstrap
  SELECT email INTO _email FROM auth.users WHERE id = _user_id;

  -- Ensure a profile row exists for this user
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id) THEN
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (_user_id, COALESCE(_email, ''), now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Set MPIN securely and reset lock counters
  UPDATE public.profiles
  SET 
    mpin_hash = extensions.crypt(mpin_text, extensions.gen_salt('bf')),
    mpin_failed_attempts = 0,
    mpin_locked_until = NULL,
    mpin_set_at = now(),
    updated_at = now()
  WHERE id = _user_id;

  GET DIAGNOSTICS _updated = ROW_COUNT;
  IF _updated = 0 THEN
    RAISE EXCEPTION 'Failed to set MPIN: profile missing';
  END IF;

  RETURN true;
END;
$function$;