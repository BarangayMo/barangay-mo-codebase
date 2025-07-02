
-- Create community posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  barangay_id TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[] DEFAULT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community comments table
CREATE TABLE public.community_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community likes table
CREATE TABLE public.community_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS on community_posts
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for community_posts
CREATE POLICY "Users can view posts in their barangay" 
  ON public.community_posts 
  FOR SELECT 
  USING (
    barangay_id = (
      SELECT barangay FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create posts in their barangay" 
  ON public.community_posts 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    barangay_id = (
      SELECT barangay FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own posts" 
  ON public.community_posts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
  ON public.community_posts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on community_comments
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for community_comments
CREATE POLICY "Users can view comments on posts in their barangay" 
  ON public.community_comments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_posts 
      WHERE community_posts.id = community_comments.post_id 
      AND community_posts.barangay_id = (
        SELECT barangay FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create comments on posts in their barangay" 
  ON public.community_comments 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.community_posts 
      WHERE community_posts.id = community_comments.post_id 
      AND community_posts.barangay_id = (
        SELECT barangay FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their own comments" 
  ON public.community_comments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.community_comments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on community_likes
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for community_likes
CREATE POLICY "Users can view likes on posts in their barangay" 
  ON public.community_likes 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.community_posts 
      WHERE community_posts.id = community_likes.post_id 
      AND community_posts.barangay_id = (
        SELECT barangay FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can like posts in their barangay" 
  ON public.community_likes 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.community_posts 
      WHERE community_posts.id = community_likes.post_id 
      AND community_posts.barangay_id = (
        SELECT barangay FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can unlike their own likes" 
  ON public.community_likes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to update post counts
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'community_comments' THEN
      UPDATE public.community_posts 
      SET comments_count = comments_count + 1 
      WHERE id = NEW.post_id;
    ELSIF TG_TABLE_NAME = 'community_likes' THEN
      UPDATE public.community_posts 
      SET likes_count = likes_count + 1 
      WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'community_comments' THEN
      UPDATE public.community_posts 
      SET comments_count = comments_count - 1 
      WHERE id = OLD.post_id;
    ELSIF TG_TABLE_NAME = 'community_likes' THEN
      UPDATE public.community_posts 
      SET likes_count = likes_count - 1 
      WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating post counts
CREATE TRIGGER update_comments_count
  AFTER INSERT OR DELETE ON public.community_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_counts();

CREATE TRIGGER update_likes_count
  AFTER INSERT OR DELETE ON public.community_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_counts();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_community_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION update_community_updated_at();

CREATE TRIGGER update_community_comments_updated_at
  BEFORE UPDATE ON public.community_comments
  FOR EACH ROW EXECUTE FUNCTION update_community_updated_at();
