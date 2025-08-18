-- Remove MPIN field from profiles table as it will now be stored locally
ALTER TABLE public.profiles DROP COLUMN IF EXISTS mpin;

-- Remove MPIN-related database functions as they're no longer needed
DROP FUNCTION IF EXISTS public.hash_mpin(text);
DROP FUNCTION IF EXISTS public.verify_mpin(text, text);
DROP FUNCTION IF EXISTS public.update_user_mpin(uuid, text);
DROP FUNCTION IF EXISTS public.verify_user_mpin(text, text);