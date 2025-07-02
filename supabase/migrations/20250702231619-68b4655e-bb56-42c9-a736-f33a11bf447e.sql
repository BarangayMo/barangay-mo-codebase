
-- Add parent_comment_id column to support threaded comments
ALTER TABLE public.community_comments 
ADD COLUMN parent_comment_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE;

-- Update the trigger to handle comment count properly for threaded comments
-- (only count top-level comments, not replies)
CREATE OR REPLACE FUNCTION public.update_post_counts()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'community_comments' THEN
      -- Only increment count for top-level comments (not replies)
      IF NEW.parent_comment_id IS NULL THEN
        UPDATE public.community_posts 
        SET comments_count = comments_count + 1 
        WHERE id = NEW.post_id;
      END IF;
    ELSIF TG_TABLE_NAME = 'community_likes' THEN
      UPDATE public.community_posts 
      SET likes_count = likes_count + 1 
      WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'community_comments' THEN
      -- Only decrement count for top-level comments (not replies)
      IF OLD.parent_comment_id IS NULL THEN
        UPDATE public.community_posts 
        SET comments_count = comments_count - 1 
        WHERE id = OLD.post_id;
      END IF;
    ELSIF TG_TABLE_NAME = 'community_likes' THEN
      UPDATE public.community_posts 
      SET likes_count = likes_count - 1 
      WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;
