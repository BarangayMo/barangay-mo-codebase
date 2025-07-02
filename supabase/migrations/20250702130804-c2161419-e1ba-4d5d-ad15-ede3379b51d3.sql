
-- Create officials table
CREATE TABLE public.officials (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    position TEXT NOT NULL,
    barangay TEXT NOT NULL,
    term_start DATE,
    term_end DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    contact_phone TEXT,
    contact_email TEXT,
    years_of_service INTEGER DEFAULT 0,
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Officials are publicly viewable" 
    ON public.officials 
    FOR SELECT 
    USING (true);

CREATE POLICY "Officials can update their own record" 
    ON public.officials 
    FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can manage all officials" 
    ON public.officials 
    FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'superadmin'
    ));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_officials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER officials_updated_at
    BEFORE UPDATE ON public.officials
    FOR EACH ROW
    EXECUTE FUNCTION update_officials_updated_at();

-- Insert some sample data
INSERT INTO public.officials (position, barangay, term_start, term_end, status, contact_phone, contact_email, years_of_service, achievements) VALUES
('Punong Barangay', 'Barangay 1', '2025-01-01', '2027-12-31', 'active', '0917-111-2222', 'juandelacruz@example.com', 8, ARRAY['Outstanding Leadership', 'Community Development']),
('Barangay Secretary', 'Barangay 1', '2025-01-01', '2027-12-31', 'active', '0918-222-3333', 'maria.santos@example.com', 5, ARRAY['Excellent Record Keeping']),
('Barangay Treasurer', 'Barangay 1', '2025-01-01', '2027-12-31', 'active', '0919-333-4444', 'pedro.reyes@example.com', 6, ARRAY['Financial Excellence']),
('Barangay Councilor', 'Barangay 1', '2025-01-01', '2027-12-31', 'active', '0920-444-5555', 'elena.garcia@example.com', 3, ARRAY['Community Engagement']),
('SK Chairman', 'Barangay 1', '2025-01-01', '2027-12-31', 'active', '0921-555-6666', 'carlos.lim@example.com', 1, ARRAY[]);
