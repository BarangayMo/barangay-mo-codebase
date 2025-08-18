-- Create barangay-logos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'barangay-logos',
  'barangay-logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Create storage policies for barangay logos
CREATE POLICY "Anyone can view barangay logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'barangay-logos');

CREATE POLICY "Officials can upload barangay logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'barangay-logos' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'official'
  )
);

CREATE POLICY "Officials can update barangay logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'barangay-logos' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'official'
  )
);

CREATE POLICY "Officials can delete barangay logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'barangay-logos' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'official'
  )
);