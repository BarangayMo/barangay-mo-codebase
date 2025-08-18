-- Enable pgcrypto for crypt() and gen_salt()
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- Ensure hashing function uses explicit schema and search_path
CREATE OR REPLACE FUNCTION public.hash_password(password_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.crypt(password_text, public.gen_salt('bf'));
END;
$$;

-- Ensure verification uses explicit schema and search_path
CREATE OR REPLACE FUNCTION public.verify_password(password_text text, password_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN password_hash = public.crypt(password_text, password_hash);
END;
$$;