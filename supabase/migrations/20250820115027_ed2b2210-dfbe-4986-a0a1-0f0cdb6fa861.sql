-- Create the OTP verifications table for phone number verification
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  user_role TEXT NOT NULL CHECK (user_role IN ('resident', 'official')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on phone_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_verifications_phone ON public.otp_verifications(phone_number);

-- Create index on expires_at for cleanup
CREATE INDEX IF NOT EXISTS idx_otp_verifications_expires ON public.otp_verifications(expires_at);

-- Enable RLS
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies for OTP verifications (public access needed for unauth users)
CREATE POLICY "Allow public read access to otp_verifications"
ON public.otp_verifications
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert to otp_verifications"
ON public.otp_verifications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update to otp_verifications"
ON public.otp_verifications
FOR UPDATE
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_otp_verifications_updated_at
BEFORE UPDATE ON public.otp_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_otp_verifications_updated_at();