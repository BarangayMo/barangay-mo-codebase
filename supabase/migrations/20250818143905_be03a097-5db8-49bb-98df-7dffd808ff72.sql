-- Add MPIN field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN mpin TEXT;

-- Add index for faster MPIN lookups
CREATE INDEX idx_profiles_mpin ON public.profiles(mpin) WHERE mpin IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.mpin IS 'Four-digit Mobile PIN for quick authentication';