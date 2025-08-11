-- STEP 1: Add original_password column to officials table for temporary password storage
ALTER TABLE public.officials ADD COLUMN IF NOT EXISTS original_password TEXT;

-- STEP 2: Create council_members table for non-auth officials management
CREATE TABLE IF NOT EXISTS public.council_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    suffix TEXT,
    position TEXT NOT NULL,
    email TEXT,
    phone_number TEXT,
    landline_number TEXT,
    barangay TEXT NOT NULL,
    municipality TEXT NOT NULL,
    province TEXT NOT NULL,
    region TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on council_members
ALTER TABLE public.council_members ENABLE ROW LEVEL SECURITY;

-- Create policies for council_members - only officials can manage them
CREATE POLICY "Officials can view council_members in their barangay" 
ON public.council_members 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'official' 
        AND profiles.barangay = council_members.barangay
    )
);

CREATE POLICY "Officials can insert council_members in their barangay" 
ON public.council_members 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'official' 
        AND profiles.barangay = council_members.barangay
    ) AND created_by = auth.uid()
);

CREATE POLICY "Officials can update council_members in their barangay" 
ON public.council_members 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'official' 
        AND profiles.barangay = council_members.barangay
    )
);

CREATE POLICY "Officials can delete council_members in their barangay" 
ON public.council_members 
FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'official' 
        AND profiles.barangay = council_members.barangay
    )
);

-- Add trigger for updating updated_at timestamp
CREATE TRIGGER update_council_members_updated_at
    BEFORE UPDATE ON public.council_members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();