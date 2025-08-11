
-- Enhanced notification function to include community posts and barangay-specific targeting
CREATE OR REPLACE FUNCTION public.notify_residents_about_new_content()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  content_type TEXT;
  content_title TEXT;
  content_message TEXT;
  content_metadata JSONB;
  target_barangay TEXT;
  author_info RECORD;
BEGIN
  -- Get author information for community posts
  IF TG_TABLE_NAME = 'community_posts' THEN
    SELECT p.first_name, p.last_name, p.barangay, p.role 
    INTO author_info 
    FROM profiles p 
    WHERE p.id = NEW.user_id;
    
    target_barangay := NEW.barangay_id;
    content_type := 'community';
    content_title := 'New Community Post';
    content_message := COALESCE(author_info.first_name || ' ' || author_info.last_name, 'A community member') || ' shared a new post in your barangay.';
    content_metadata := jsonb_build_object(
      'post_id', NEW.id, 
      'action_url', '/community',
      'author_id', NEW.user_id,
      'barangay_id', NEW.barangay_id
    );
  ELSIF TG_TABLE_NAME = 'jobs' THEN
    -- Get barangay from job location or creator's profile
    SELECT p.barangay INTO target_barangay
    FROM profiles p 
    WHERE p.id = COALESCE(NEW.created_by, NEW.assigned_to);
    
    content_type := 'job';
    content_title := 'New Job Posted: ' || NEW.title;
    content_message := 'A new job opportunity "' || NEW.title || '" has been posted at ' || COALESCE(NEW.company, 'a company') || '.';
    content_metadata := jsonb_build_object(
      'job_id', NEW.id, 
      'action_url', '/jobs/' || NEW.id,
      'company', NEW.company,
      'location', NEW.location
    );
  ELSIF TG_TABLE_NAME = 'services' THEN
    -- Get barangay from service creator's profile
    SELECT p.barangay INTO target_barangay
    FROM profiles p 
    WHERE p.id = NEW.created_by;
    
    content_type := 'service';
    content_title := 'New Service Available: ' || NEW.title;
    content_message := 'A new service "' || NEW.title || '" is now available in your barangay.';
    content_metadata := jsonb_build_object(
      'service_id', NEW.id, 
      'action_url', '/services/' || NEW.id,
      'category', NEW.category
    );
  ELSIF TG_TABLE_NAME = 'products' THEN
    -- Get barangay from product vendor's profile
    SELECT p.barangay INTO target_barangay
    FROM profiles p 
    JOIN vendors v ON v.user_id = p.id
    WHERE v.id = NEW.vendor_id;
    
    content_type := 'product';
    content_title := 'New Product Listed: ' || NEW.name;
    content_message := 'A new product "' || NEW.name || '" has been listed in the marketplace.';
    content_metadata := jsonb_build_object(
      'product_id', NEW.id, 
      'action_url', '/marketplace/products/' || NEW.id,
      'category', NEW.category,
      'price', NEW.price
    );
  ELSE
    RETURN NEW; -- Unknown table, skip notification
  END IF;

  -- Only proceed if we have a target barangay
  IF target_barangay IS NULL THEN
    RAISE WARNING 'No target barangay found for % notification', content_type;
    RETURN NEW;
  END IF;

  -- Insert notification for approved residents and officials in the same barangay
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
  WHERE p.barangay = target_barangay
    AND p.is_approved = true
    AND p.role IN ('resident', 'official')
    AND p.id != COALESCE(NEW.user_id, NEW.created_by); -- Don't notify the creator

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent the main operation
    RAISE WARNING 'Failed to create notifications for %: %', content_type, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for community posts
DROP TRIGGER IF EXISTS trigger_notify_community_posts ON public.community_posts;
CREATE TRIGGER trigger_notify_community_posts
  AFTER INSERT ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_residents_about_new_content();

-- Ensure triggers exist for other content types
DROP TRIGGER IF EXISTS trigger_notify_jobs ON public.jobs;
CREATE TRIGGER trigger_notify_jobs
  AFTER INSERT ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_residents_about_new_content();

DROP TRIGGER IF EXISTS trigger_notify_services ON public.services;
CREATE TRIGGER trigger_notify_services
  AFTER INSERT ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_residents_about_new_content();

DROP TRIGGER IF EXISTS trigger_notify_products ON public.products;
CREATE TRIGGER trigger_notify_products
  AFTER INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_residents_about_new_content();
