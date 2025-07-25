-- Create RLS policies to enforce approval requirement for officials

-- First, create a function to check if a user is an approved official
CREATE OR REPLACE FUNCTION public.is_approved_official(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.officials 
    WHERE officials.user_id = $1 
    AND officials.status = 'approved' 
    AND officials.is_approved = true
  );
$$;

-- Create RLS policy for profiles table to restrict unapproved officials
CREATE POLICY "Approved officials can access profiles" 
ON public.profiles 
FOR ALL 
USING (
  CASE 
    WHEN role = 'official' THEN public.is_approved_official(auth.uid())
    ELSE true  -- Non-officials have normal access
  END
);

-- Create RLS policy for officials table
CREATE POLICY "Officials can only see their own record when approved" 
ON public.officials 
FOR SELECT 
USING (
  user_id = auth.uid() AND status = 'approved' AND is_approved = true
);

-- Super-admins can manage all official records
CREATE POLICY "Super-admins can manage all officials" 
ON public.officials 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'superadmin'
  )
);

-- Restrict access to other sensitive tables for unapproved officials
CREATE POLICY "Approved officials only for complaints_requests" 
ON public.complaints_requests 
FOR ALL 
USING (
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'official') 
    THEN public.is_approved_official(auth.uid())
    ELSE true  -- Non-officials have normal access
  END
);

CREATE POLICY "Approved officials only for community_posts" 
ON public.community_posts 
FOR ALL 
USING (
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'official') 
    THEN public.is_approved_official(auth.uid())
    ELSE true  -- Non-officials have normal access
  END
);

CREATE POLICY "Approved officials only for budget_allocations" 
ON public.budget_allocations 
FOR ALL 
USING (
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'official') 
    THEN public.is_approved_official(auth.uid())
    ELSE true  -- Non-officials have normal access
  END
);

-- Update the handle_new_user function to handle officials with pending status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_is_approved boolean;
BEGIN
  -- Determine if user should be approved based on role and status
  user_is_approved := CASE 
    WHEN NEW.raw_user_meta_data ->> 'role' = 'official' 
    THEN (NEW.raw_user_meta_data ->> 'status' = 'approved')
    ELSE true  -- Non-officials are approved by default
  END;

  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    middle_name,
    suffix,
    phone_number,
    landline_number,
    barangay,
    municipality,
    province,
    region,
    role,
    email,
    is_approved
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'middle_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'suffix', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone_number', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'landline_number', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'barangay', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'municipality', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'province', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'region', ''),
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'role' = 'resident' THEN 'resident'::user_role
      WHEN NEW.raw_user_meta_data ->> 'role' = 'official' THEN 'official'::user_role
      WHEN NEW.raw_user_meta_data ->> 'role' = 'superadmin' THEN 'superadmin'::user_role
      ELSE 'resident'::user_role
    END,
    NEW.email,
    user_is_approved
  );
  RETURN NEW;
END;
$$;