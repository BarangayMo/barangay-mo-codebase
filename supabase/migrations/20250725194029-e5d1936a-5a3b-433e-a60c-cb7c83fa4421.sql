-- Fix the notification function to work with existing table structure
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
  content_metadata JSONB;
BEGIN
  -- Determine content type and details based on table
  IF TG_TABLE_NAME = 'jobs' THEN
    content_type := 'job';
    content_title := 'New Job Posted: ' || NEW.title;
    content_message := 'A new job opportunity "' || NEW.title || '" has been posted at ' || COALESCE(NEW.company, 'a company') || '.';
    content_metadata := jsonb_build_object('job_id', NEW.id, 'action_url', '/jobs/' || NEW.id);
  ELSIF TG_TABLE_NAME = 'services' THEN
    content_type := 'service';
    content_title := 'New Service Available: ' || NEW.title;
    content_message := 'A new service "' || NEW.title || '" is now available in your area.';
    content_metadata := jsonb_build_object('service_id', NEW.id, 'action_url', '/services/' || NEW.id);
  ELSIF TG_TABLE_NAME = 'products' THEN
    content_type := 'product';
    content_title := 'New Product Listed: ' || NEW.name;
    content_message := 'A new product "' || NEW.name || '" has been listed in the marketplace.';
    content_metadata := jsonb_build_object('product_id', NEW.id, 'action_url', '/marketplace/products/' || NEW.id);
  ELSE
    RETURN NEW; -- Unknown table, skip notification
  END IF;

  -- Insert notification for all approved residents
  INSERT INTO public.notifications (
    recipient_id,
    title,
    message,
    category,
    status,
    priority,
    metadata,
    created_at,
    updated_at
  )
  SELECT 
    p.id,
    content_title,
    content_message,
    content_type,
    'unread',
    'normal',
    content_metadata,
    NOW(),
    NOW()
  FROM public.profiles p
  WHERE p.role = 'resident'
    AND p.is_approved = true;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent the main operation
    RAISE WARNING 'Failed to create notifications: %', SQLERRM;
    RETURN NEW;
END;
$$;