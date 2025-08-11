
-- Add 5 more jobs with different assignments
INSERT INTO public.jobs (
  title, 
  company, 
  location, 
  category, 
  salary, 
  experience, 
  work_approach, 
  description, 
  responsibilities, 
  qualifications, 
  skills, 
  is_open,
  assigned_to
) VALUES 
(
  'Frontend Developer',
  'TechCorp Solutions',
  'Quezon City, Metro Manila',
  'Technology',
  '₱45,000 - ₱65,000',
  'Mid Level',
  'Hybrid',
  'We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for creating engaging user interfaces and ensuring excellent user experience across our web applications.',
  ARRAY['Develop responsive web applications', 'Collaborate with design team', 'Optimize application performance', 'Write clean, maintainable code'],
  ARRAY['Bachelor''s degree in Computer Science or related field', '3+ years of frontend development experience', 'Strong portfolio of web applications'],
  ARRAY['React', 'TypeScript', 'HTML/CSS', 'JavaScript', 'Git'],
  true,
  (SELECT id FROM public.profiles WHERE role = 'official' LIMIT 1)
),
(
  'Marketing Specialist',
  'Creative Media Inc',
  'Makati City, Metro Manila',
  'Marketing',
  '₱35,000 - ₱50,000',
  'Entry Level',
  'On-site',
  'Join our marketing team to develop and execute creative marketing campaigns. Perfect opportunity for someone looking to grow their career in digital marketing.',
  ARRAY['Create marketing campaigns', 'Manage social media accounts', 'Analyze campaign performance', 'Coordinate with external agencies'],
  ARRAY['Bachelor''s degree in Marketing or related field', 'Strong communication skills', 'Creative mindset'],
  ARRAY['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics', 'Adobe Creative Suite'],
  true,
  (SELECT id FROM public.profiles WHERE role = 'superadmin' LIMIT 1)
),
(
  'Data Analyst',
  'DataViz Analytics',
  'Taguig City, Metro Manila',
  'Technology',
  '₱40,000 - ₱60,000',
  'Mid Level',
  'Remote',
  'We need a detail-oriented Data Analyst to help us make data-driven decisions. You will work with large datasets and create meaningful insights for our business.',
  ARRAY['Analyze complex datasets', 'Create data visualizations', 'Prepare analytical reports', 'Work with stakeholders to understand requirements'],
  ARRAY['Bachelor''s degree in Statistics, Mathematics, or related field', '2+ years of data analysis experience', 'Strong analytical skills'],
  ARRAY['SQL', 'Python', 'Excel', 'Tableau', 'Statistical Analysis'],
  true,
  (SELECT id FROM public.profiles WHERE role = 'resident' ORDER BY created_at LIMIT 1)
),
(
  'Customer Service Representative',
  'ServiceFirst BPO',
  'Pasig City, Metro Manila',
  'Customer Service',
  '₱25,000 - ₱35,000',
  'Entry Level',
  'On-site',
  'Provide exceptional customer service to our clients. Great opportunity for fresh graduates or those starting their career in customer service.',
  ARRAY['Handle customer inquiries', 'Resolve customer complaints', 'Process orders and returns', 'Maintain customer records'],
  ARRAY['High school diploma or equivalent', 'Excellent communication skills', 'Customer-focused attitude'],
  ARRAY['Communication', 'Problem Solving', 'Computer Skills', 'Patience', 'Multitasking'],
  false,
  (SELECT id FROM public.profiles WHERE role = 'official' ORDER BY created_at DESC LIMIT 1)
),
(
  'Graphic Designer',
  'Design Studio Pro',
  'Manila City, Metro Manila',
  'Creative',
  '₱30,000 - ₱45,000',
  'Mid Level',
  'Hybrid',
  'Creative Graphic Designer needed to work on various design projects including branding, marketing materials, and digital assets.',
  ARRAY['Create visual designs for marketing materials', 'Develop brand guidelines', 'Work with clients on design requirements', 'Manage multiple design projects'],
  ARRAY['Bachelor''s degree in Graphic Design or related field', '3+ years of design experience', 'Strong portfolio of design work'],
  ARRAY['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Branding'],
  true,
  (SELECT id FROM public.profiles WHERE role = 'superadmin' ORDER BY created_at DESC LIMIT 1)
);

-- =====================
-- OFFICIALS TABLE RLS POLICIES FOR FULL CRUD BY OFFICIALS
-- =====================

-- Remove restrictive Edge Function-only insert policy if it exists
DROP POLICY IF EXISTS "Only Edge Function can insert officials" ON public.officials;

-- Allow officials to view officials in their barangay
CREATE POLICY "Officials can view officials in their barangay"
ON public.officials
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'official'
      AND profiles.barangay = officials.barangay
  )
);

-- Allow officials to add officials in their barangay
CREATE POLICY "Officials can add officials in their barangay"
ON public.officials
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'official'
      AND profiles.barangay = barangay
  )
);

-- Allow officials to update officials in their barangay
CREATE POLICY "Officials can update officials in their barangay"
ON public.officials
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'official'
      AND profiles.barangay = officials.barangay
  )
);

-- Allow officials to delete other officials in their barangay, but NOT themselves
CREATE POLICY "Officials can delete other officials in their barangay"
ON public.officials
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'official'
      AND profiles.barangay = officials.barangay
  )
  AND user_id IS DISTINCT FROM auth.uid()
);

-- (Optional) Allow superadmins to manage all officials
CREATE POLICY "Superadmins can manage all officials"
ON public.officials
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin'
  )
);
