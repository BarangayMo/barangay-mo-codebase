
-- Add is_approved column to profiles table for member approval system
ALTER TABLE public.profiles 
ADD COLUMN is_approved BOOLEAN DEFAULT false;

-- Update RLS policies to check approval status for marketplace actions
CREATE POLICY "Only approved users can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND is_approved = true 
    AND role IN ('official', 'resident')
  )
);

CREATE POLICY "Only approved users can view products" 
ON public.products 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND is_approved = true 
    AND role IN ('official', 'resident', 'superadmin')
  )
);

-- Create a vendors table entry for users when they're approved (if not exists)
CREATE OR REPLACE FUNCTION public.create_vendor_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- When a user is approved, create a vendor entry if they don't have one
  IF NEW.is_approved = true AND OLD.is_approved = false THEN
    INSERT INTO public.vendors (user_id, shop_name, contact_email, status)
    VALUES (
      NEW.id,
      COALESCE(NEW.first_name || ' ' || NEW.last_name, 'User Shop'),
      NEW.email,
      'active'
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for vendor creation on approval
DROP TRIGGER IF EXISTS trigger_create_vendor_on_approval ON public.profiles;
CREATE TRIGGER trigger_create_vendor_on_approval
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_vendor_on_approval();
