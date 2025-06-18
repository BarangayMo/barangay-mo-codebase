
-- Create campaigns table for officials to manage their campaigns
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10,2),
  target_audience TEXT,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  platform TEXT, -- facebook, instagram, community, etc.
  campaign_type TEXT NOT NULL DEFAULT 'community' CHECK (campaign_type IN ('community', 'health', 'education', 'infrastructure', 'safety'))
);

-- Create budget allocations table
CREATE TABLE public.budget_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  allocated_amount DECIMAL(12,2) NOT NULL,
  spent_amount DECIMAL(12,2) DEFAULT 0,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  quarter INTEGER CHECK (quarter BETWEEN 1 AND 4),
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community events table
CREATE TABLE public.community_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
  attendees_count INTEGER DEFAULT 0,
  max_capacity INTEGER,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create official documents table
CREATE TABLE public.official_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_url TEXT,
  description TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for campaigns
CREATE POLICY "Officials can view campaigns in their barangay" 
  ON public.campaigns FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('official', 'superadmin')
    )
  );

CREATE POLICY "Officials can create campaigns" 
  ON public.campaigns FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('official', 'superadmin')
    ) AND created_by = auth.uid()
  );

CREATE POLICY "Officials can update their campaigns" 
  ON public.campaigns FOR UPDATE 
  USING (created_by = auth.uid());

-- Create RLS policies for budget allocations
CREATE POLICY "Officials can view budget allocations" 
  ON public.budget_allocations FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('official', 'superadmin')
    )
  );

CREATE POLICY "Officials can create budget allocations" 
  ON public.budget_allocations FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('official', 'superadmin')
    ) AND created_by = auth.uid()
  );

-- Create RLS policies for community events
CREATE POLICY "Everyone can view public community events" 
  ON public.community_events FOR SELECT 
  USING (true);

CREATE POLICY "Officials can create community events" 
  ON public.community_events FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('official', 'superadmin')
    ) AND created_by = auth.uid()
  );

CREATE POLICY "Officials can update their community events" 
  ON public.community_events FOR UPDATE 
  USING (created_by = auth.uid());

-- Create RLS policies for official documents
CREATE POLICY "Officials can view official documents" 
  ON public.official_documents FOR SELECT 
  USING (
    is_public = true OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('official', 'superadmin')
    )
  );

CREATE POLICY "Officials can create official documents" 
  ON public.official_documents FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('official', 'superadmin')
    ) AND created_by = auth.uid()
  );

-- Add some sample data for demonstration
INSERT INTO public.budget_allocations (category, allocated_amount, spent_amount, created_by) VALUES
('Infrastructure', 500000.00, 125000.00, (SELECT id FROM auth.users LIMIT 1)),
('Health Programs', 200000.00, 45000.00, (SELECT id FROM auth.users LIMIT 1)),
('Education', 150000.00, 30000.00, (SELECT id FROM auth.users LIMIT 1)),
('Safety & Security', 100000.00, 25000.00, (SELECT id FROM auth.users LIMIT 1)),
('Community Events', 75000.00, 15000.00, (SELECT id FROM auth.users LIMIT 1));
