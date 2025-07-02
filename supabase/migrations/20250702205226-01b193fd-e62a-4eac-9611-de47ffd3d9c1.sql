
-- Insert some test posts for the community
INSERT INTO public.community_posts (user_id, barangay_id, content, likes_count, comments_count, created_at) VALUES
(
  (SELECT id FROM profiles WHERE first_name IS NOT NULL LIMIT 1),
  (SELECT barangay FROM profiles WHERE first_name IS NOT NULL LIMIT 1),
  'Chill lang tayo',
  5,
  2,
  NOW() - INTERVAL '1 week'
),
(
  (SELECT id FROM profiles WHERE first_name IS NOT NULL LIMIT 1),
  (SELECT barangay FROM profiles WHERE first_name IS NOT NULL LIMIT 1),
  'Good morning everyone! Hope you all have a great day ahead. The weather is perfect for outdoor activities.',
  12,
  8,
  NOW() - INTERVAL '2 days'
),
(
  (SELECT id FROM profiles WHERE first_name IS NOT NULL LIMIT 1),
  (SELECT barangay FROM profiles WHERE first_name IS NOT NULL LIMIT 1),
  'Just finished our community cleanup drive. Thank you to all the volunteers who participated!',
  25,
  15,
  NOW() - INTERVAL '3 hours'
);

-- Update some profiles with more realistic names for testing
UPDATE public.profiles 
SET first_name = 'Lester', last_name = 'Nadong'
WHERE id = (SELECT id FROM profiles WHERE first_name IS NOT NULL LIMIT 1);
