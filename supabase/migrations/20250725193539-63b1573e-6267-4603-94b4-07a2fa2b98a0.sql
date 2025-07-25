-- Create function to notify residents about new content
CREATE OR REPLACE FUNCTION public.notify_residents_about_new_content()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create triggers for jobs table
DROP TRIGGER IF EXISTS notify_residents_new_job ON public.jobs;
CREATE TRIGGER notify_residents_new_job
  AFTER INSERT ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_residents_about_new_content();

-- Create triggers for services table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services' AND table_schema = 'public') THEN
    DROP TRIGGER IF EXISTS notify_residents_new_service ON public.services;
    CREATE TRIGGER notify_residents_new_service
      AFTER INSERT ON public.services
      FOR EACH ROW
      EXECUTE FUNCTION public.notify_residents_about_new_content();
  END IF;
END $$;

-- Create triggers for products table
DROP TRIGGER IF EXISTS notify_residents_new_product ON public.products;
CREATE TRIGGER notify_residents_new_product
  AFTER INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_residents_about_new_content();