
-- Create complaints_requests table for handling community complaints and requests
CREATE TABLE public.complaints_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  barangay_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'complaint',
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create services table for barangay-specific services
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL DEFAULT 'general',
  created_by UUID NOT NULL,
  barangay_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  requirements TEXT[],
  contact_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rbi_forms table for RBI submissions (if not exists)
CREATE TABLE IF NOT EXISTS public.rbi_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  form_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  barangay_id TEXT
);

-- Add RLS policies for complaints_requests
ALTER TABLE public.complaints_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own complaints" 
  ON public.complaints_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own complaints" 
  ON public.complaints_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Officials can view complaints in their barangay" 
  ON public.complaints_requests 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'official' 
      AND barangay = complaints_requests.barangay_id
    )
  );

CREATE POLICY "Officials can update complaints in their barangay" 
  ON public.complaints_requests 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'official' 
      AND barangay = complaints_requests.barangay_id
    )
  );

-- Add RLS policies for services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active services in their barangay" 
  ON public.services 
  FOR SELECT 
  USING (
    is_active = true AND (
      barangay_id = (
        SELECT barangay FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Officials can manage services in their barangay" 
  ON public.services 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'official' 
      AND barangay = services.barangay_id
    )
  );

-- Add RLS policies for rbi_forms (if not already exists)
ALTER TABLE public.rbi_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own RBI forms" 
  ON public.rbi_forms 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Officials can view RBI forms in their barangay" 
  ON public.rbi_forms 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'official' 
      AND barangay = rbi_forms.barangay_id
    )
  );

-- Add update triggers
CREATE OR REPLACE FUNCTION update_complaints_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_complaints_requests_updated_at
  BEFORE UPDATE ON public.complaints_requests
  FOR EACH ROW EXECUTE PROCEDURE update_complaints_requests_updated_at();

CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE PROCEDURE update_services_updated_at();
