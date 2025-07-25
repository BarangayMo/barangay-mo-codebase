-- Update function to fix security warning by setting search_path
CREATE OR REPLACE FUNCTION public.notify_residents_about_new_content()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  content_type TEXT;
  content_title TEXT;
  content_message TEXT;
  action_url TEXT;
  resident_record RECORD;
BEGIN
  -- Determine content type and details based on table
  IF TG_TABLE_NAME = 'jobs' THEN
    content_type := 'job';
    content_title := 'New Job Posted: ' || NEW.title;
    content_message := 'A new job opportunity "' || NEW.title || '" has been posted at ' || NEW.company || '.';
    action_url := '/jobs/' || NEW.id;
  ELSIF TG_TABLE_NAME = 'services' THEN
    content_type := 'service';
    content_title := 'New Service Available: ' || NEW.title;
    content_message := 'A new service "' || NEW.title || '" is now available in your area.';
    action_url := '/services/' || NEW.id;
  ELSIF TG_TABLE_NAME = 'products' THEN
    content_type := 'product';
    content_title := 'New Product Listed: ' || NEW.name;
    content_message := 'A new product "' || NEW.name || '" has been listed in the marketplace.';
    action_url := '/marketplace/products/' || NEW.id;
  ELSE
    RETURN NEW; -- Unknown table, skip notification
  END IF;

  -- Insert notification for all approved residents
  INSERT INTO public.notifications (
    recipient_id,
    title,
    message,
    category,
    action_url,
    status,
    created_at
  )
  SELECT 
    p.id,
    content_title,
    content_message,
    content_type,
    action_url,
    'unread',
    NOW()
  FROM public.profiles p
  WHERE p.role = 'resident'
    AND p.is_approved = true;

  RETURN NEW;
END;
$$;