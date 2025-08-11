-- Create officials table for storing pending registration forms
CREATE TABLE public.officials (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    suffix TEXT,
    phone_number TEXT NOT NULL,
    landline_number TEXT,
    email TEXT NOT NULL UNIQUE,
    position TEXT NOT NULL,
    barangay TEXT NOT NULL,
    municipality TEXT NOT NULL,
    province TEXT NOT NULL,
    region TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_approved BOOLEAN NOT NULL DEFAULT false,
    rejection_reason TEXT,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;

-- Create policies for officials table
CREATE POLICY "Super-admins can view all officials" 
ON public.officials 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 
        FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'superadmin'
    )
);

CREATE POLICY "Super-admins can update officials" 
ON public.officials 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 
        FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'superadmin'
    )
);

CREATE POLICY "Anyone can insert pending officials" 
ON public.officials 
FOR INSERT 
WITH CHECK (status = 'pending' AND is_approved = false);

-- Create trigger for updating timestamps
CREATE TRIGGER update_officials_updated_at
    BEFORE UPDATE ON public.officials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle official approval
CREATE OR REPLACE FUNCTION public.approve_official(official_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    official_record RECORD;
    new_user_id UUID;
BEGIN
    -- Get the official record
    SELECT * INTO official_record 
    FROM public.officials 
    WHERE id = official_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Official not found';
    END IF;
    
    -- Check if user has permission (super-admin)
    IF NOT EXISTS (
        SELECT 1 
        FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'superadmin'
    ) THEN
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;
    
    -- Create auth user if not exists
    IF official_record.user_id IS NULL THEN
        -- Generate a temporary password (they'll need to reset it)
        INSERT INTO auth.users (
            email,
            raw_user_meta_data,
            email_confirmed_at,
            created_at,
            updated_at
        ) VALUES (
            official_record.email,
            jsonb_build_object(
                'first_name', official_record.first_name,
                'last_name', official_record.last_name,
                'middle_name', official_record.middle_name,
                'suffix', official_record.suffix,
                'phone_number', official_record.phone_number,
                'landline_number', official_record.landline_number,
                'barangay', official_record.barangay,
                'municipality', official_record.municipality,
                'province', official_record.province,
                'region', official_record.region,
                'role', 'official'
            ),
            now(),
            now(),
            now()
        ) RETURNING id INTO new_user_id;
        
        -- Update the official record with the new user_id
        UPDATE public.officials 
        SET user_id = new_user_id 
        WHERE id = official_id;
    END IF;
    
    -- Update official status
    UPDATE public.officials 
    SET 
        status = 'approved',
        is_approved = true,
        approved_by = auth.uid(),
        approved_at = now(),
        updated_at = now()
    WHERE id = official_id;
END;
$$;