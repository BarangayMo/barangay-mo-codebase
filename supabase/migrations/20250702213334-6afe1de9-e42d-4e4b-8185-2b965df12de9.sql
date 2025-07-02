
-- Step 1: Assign real barangays to existing users
UPDATE public.profiles 
SET barangay = 'Valeriana, Zaragoza, Nueva Ecija'
WHERE id = '8c5f85e3-823e-4987-908a-01653e030e73'; -- Lester Nadong (official)

UPDATE public.profiles 
SET barangay = 'Santo Rosario Young, Zaragoza, Nueva Ecija'
WHERE first_name = 'Walt' AND last_name = 'Odibi';

UPDATE public.profiles 
SET barangay = 'Santa Lucia Young, Zaragoza, Nueva Ecija'
WHERE first_name = 'Walter' AND last_name = 'Odibi';

-- Update any other users to have barangays from Nueva Ecija
UPDATE public.profiles 
SET barangay = 'Valeriana, Zaragoza, Nueva Ecija'
WHERE barangay IS NULL AND id != '8c5f85e3-823e-4987-908a-01653e030e73';

-- Step 2: Create community posts by Lester Nadong (Official)
INSERT INTO public.community_posts (user_id, barangay_id, content, image_urls, likes_count, comments_count, created_at) VALUES
(
  '8c5f85e3-823e-4987-908a-01653e030e73',
  'Valeriana, Zaragoza, Nueva Ecija',
  'Maligayang umaga sa lahat! Reminder sa aming mga kababayan sa Barangay Valeriana - mayroon tayong community meeting bukas ng 7 PM sa barangay hall. Makikipag-usap tayo tungkol sa mga proyektong paparating.',
  ARRAY['/lovable-uploads/02005d02-8f81-4c95-be8e-ba9d8eb3e0d1.jpg'],
  8,
  3,
  NOW() - INTERVAL '2 days'
),
(
  '8c5f85e3-823e-4987-908a-01653e030e73',
  'Valeriana, Zaragoza, Nueva Ecija',
  'Salamat sa lahat ng dumalo sa aming cleanup drive kagabi! Nakita natin ang galing ng aming barangay kapag nagtutulungan tayo. 💪',
  ARRAY['/lovable-uploads/13aba568-e026-4cfb-a117-604758fe79f1.jpg'],
  15,
  6,
  NOW() - INTERVAL '1 day'
),
(
  '8c5f85e3-823e-4987-908a-01653e030e73',
  'Valeriana, Zaragoza, Nueva Ecija',
  'Paalala: Ang aming new basketball court sa Valeriana ay bukas na para sa lahat. Tara na mga kabataan, mag-practice na tayo!',
  NULL,
  12,
  4,
  NOW() - INTERVAL '4 hours'
);

-- Step 3: Create comments from real users
-- Get the post IDs first, then insert comments
INSERT INTO public.community_comments (post_id, user_id, content, created_at)
SELECT 
  cp.id,
  (SELECT id FROM profiles WHERE first_name = 'Walt' AND last_name = 'Odibi'),
  'Salamat Kap! Makakadalo po ako sa meeting.',
  NOW() - INTERVAL '1 day'
FROM public.community_posts cp 
WHERE cp.content LIKE 'Maligayang umaga sa lahat!%'
LIMIT 1;

INSERT INTO public.community_comments (post_id, user_id, content, created_at)
SELECT 
  cp.id,
  (SELECT id FROM profiles WHERE first_name = 'Walter' AND last_name = 'Odibi'),
  'Magandang balita ito para sa aming barangay!',
  NOW() - INTERVAL '1 day'
FROM public.community_posts cp 
WHERE cp.content LIKE 'Maligayang umaga sa lahat!%'
LIMIT 1;

INSERT INTO public.community_comments (post_id, user_id, content, created_at)
SELECT 
  cp.id,
  (SELECT id FROM profiles WHERE barangay = 'Valeriana, Zaragoza, Nueva Ecija' AND id != '8c5f85e3-823e-4987-908a-01653e030e73' LIMIT 1),
  'Salamat sa paalala Kap!',
  NOW() - INTERVAL '20 hours'
FROM public.community_posts cp 
WHERE cp.content LIKE 'Maligayang umaga sa lahat!%'
LIMIT 1;

-- Comments for cleanup post
INSERT INTO public.community_comments (post_id, user_id, content, created_at)
SELECT 
  cp.id,
  (SELECT id FROM profiles WHERE first_name = 'Walt' AND last_name = 'Odibi'),
  'Nakakamiss yung cleanup drive! Next time kasama na ulit ako.',
  NOW() - INTERVAL '20 hours'
FROM public.community_posts cp 
WHERE cp.content LIKE 'Salamat sa lahat ng dumalo%'
LIMIT 1;

INSERT INTO public.community_comments (post_id, user_id, content, created_at)
SELECT 
  cp.id,
  (SELECT id FROM profiles WHERE first_name = 'Walter' AND last_name = 'Odibi'),
  'Galing ng coordination ng barangay officials. Keep it up!',
  NOW() - INTERVAL '18 hours'
FROM public.community_posts cp 
WHERE cp.content LIKE 'Salamat sa lahat ng dumalo%'
LIMIT 1;

-- Step 4: Create likes for the posts
-- Likes for first post (meeting announcement)
INSERT INTO public.community_likes (post_id, user_id, created_at)
SELECT 
  cp.id,
  (SELECT id FROM profiles WHERE first_name = 'Walt' AND last_name = 'Odibi'),
  NOW() - INTERVAL '1 day'
FROM public.community_posts cp 
WHERE cp.content LIKE 'Maligayang umaga sa lahat!%'
LIMIT 1;

INSERT INTO public.community_likes (post_id, user_id, created_at)
SELECT 
  cp.id,
  (SELECT id FROM profiles WHERE first_name = 'Walter' AND last_name = 'Odibi'),
  NOW() - INTERVAL '1 day'
FROM public.community_posts cp 
WHERE cp.content LIKE 'Maligayang umaga sa lahat!%'
LIMIT 1;

-- Likes for cleanup post
INSERT INTO public.community_likes (post_id, user_id, created_at)
SELECT 
  cp.id,
  (SELECT id FROM profiles WHERE first_name = 'Walt' AND last_name = 'Odibi'),
  NOW() - INTERVAL '20 hours'
FROM public.community_posts cp 
WHERE cp.content LIKE 'Salamat sa lahat ng dumalo%'
LIMIT 1;

INSERT INTO public.community_likes (post_id, user_id, created_at)
SELECT 
  cp.id,
  (SELECT id FROM profiles WHERE first_name = 'Walter' AND last_name = 'Odibi'),
  NOW() - INTERVAL '18 hours'
FROM public.community_posts cp 
WHERE cp.content LIKE 'Salamat sa lahat ng dumalo%'
LIMIT 1;

-- Likes for basketball court post
INSERT INTO public.community_likes (post_id, user_id, created_at)
SELECT 
  cp.id,
  (SELECT id FROM profiles WHERE first_name = 'Walt' AND last_name = 'Odibi'),
  NOW() - INTERVAL '3 hours'
FROM public.community_posts cp 
WHERE cp.content LIKE 'Paalala: Ang aming new basketball court%'
LIMIT 1;
