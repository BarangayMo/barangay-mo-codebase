
-- Add approval status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add approved_at and approved_by columns for tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);

-- Update existing users to be approved (for backward compatibility)
UPDATE public.profiles 
SET is_approved = true, approved_at = now() 
WHERE role IN ('superadmin', 'official');

-- Create function to check if user is approved
CREATE OR REPLACE FUNCTION public.is_user_approved(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(is_approved, false) 
  FROM public.profiles 
  WHERE id = user_id;
$$;

-- Update products table RLS policies to require approval
DROP POLICY IF EXISTS "Users can view products" ON public.products;
DROP POLICY IF EXISTS "Users can insert products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;

CREATE POLICY "Approved users can view products" 
ON public.products 
FOR SELECT 
USING (public.is_user_approved(auth.uid()));

CREATE POLICY "Approved users can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND public.is_user_approved(auth.uid())
);

CREATE POLICY "Approved users can update their own products" 
ON public.products 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  AND public.is_user_approved(auth.uid())
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_approved ON public.profiles(is_approved) WHERE is_approved = true;

-- Create approval management functions for admins
CREATE OR REPLACE FUNCTION public.approve_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only superadmins can approve users
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'superadmin'
  ) THEN
    RAISE EXCEPTION 'Only superadmins can approve users';
  END IF;
  
  UPDATE public.profiles 
  SET 
    is_approved = true,
    approved_at = now(),
    approved_by = auth.uid()
  WHERE id = target_user_id;
END;
$$;
