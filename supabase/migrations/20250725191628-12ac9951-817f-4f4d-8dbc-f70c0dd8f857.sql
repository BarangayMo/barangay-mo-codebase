
-- First, let's ensure the vendors table has the correct structure and constraints
-- Add unique constraint on user_id to prevent duplicate vendors
ALTER TABLE vendors 
ADD CONSTRAINT vendors_user_id_unique UNIQUE (user_id);

-- Create RLS policy to allow authenticated users to insert their own vendor
CREATE POLICY "Users can create their own vendor" ON vendors
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create RLS policy to allow users to view their own vendor
CREATE POLICY "Users can view their own vendor" ON vendors
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create RLS policy to allow users to update their own vendor
CREATE POLICY "Users can update their own vendor" ON vendors
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Enable RLS on vendors table if not already enabled
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
