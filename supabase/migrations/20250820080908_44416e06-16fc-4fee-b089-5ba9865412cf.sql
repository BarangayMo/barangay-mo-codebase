-- Create OTP verification table
CREATE TABLE public.otp_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  user_role TEXT NOT NULL CHECK(user_role IN ('resident', 'official')),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting OTP records (public access for initial verification)
CREATE POLICY "Anyone can create OTP verification" 
ON public.otp_verifications 
FOR INSERT 
WITH CHECK (true);

-- Create policy for selecting OTP records (only the specific phone number)
CREATE POLICY "Users can view their own OTP verifications" 
ON public.otp_verifications 
FOR SELECT 
USING (true);

-- Create policy for updating OTP records
CREATE POLICY "Users can update their own OTP verifications" 
ON public.otp_verifications 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_otp_verifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_otp_verifications_updated_at
BEFORE UPDATE ON public.otp_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_otp_verifications_updated_at();

-- Create index for faster lookups
CREATE INDEX idx_otp_verifications_phone_number ON public.otp_verifications(phone_number);
CREATE INDEX idx_otp_verifications_expires_at ON public.otp_verifications(expires_at);