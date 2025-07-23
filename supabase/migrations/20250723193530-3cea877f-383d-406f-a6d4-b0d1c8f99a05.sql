-- Create wishlist table
CREATE TABLE public.wishlists (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own wishlist items" 
ON public.wishlists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist items" 
ON public.wishlists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items" 
ON public.wishlists 
FOR DELETE 
USING (auth.uid() = user_id);