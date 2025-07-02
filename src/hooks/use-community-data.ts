
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface CommunityPost {
  id: string;
  user_id: string;
  barangay_id: string;
  content: string;
  image_urls: string[] | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
  user_has_liked?: boolean;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

export const useCommunityPosts = (limit?: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['community-posts', user?.id, limit],
    queryFn: async () => {
      console.log('Fetching community posts for user:', user?.id);
      
      if (!user?.id) {
        console.log('No user ID found');
        return [];
      }

      // Get user's barangay
      const { data: profile } = await supabase
        .from('profiles')
        .select('barangay')
        .eq('id', user.id)
        .single();

      console.log('User profile:', profile);

      if (!profile?.barangay) {
        console.log('No barangay found for user');
        return [];
      }

      let query = supabase
        .from('community_posts')
        .select(`
          *,
          profiles!community_posts_user_id_fkey (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('barangay_id', profile.barangay)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data: posts, error } = await query;
      
      console.log('Community posts query result:', { data: posts, error });
      
      if (error) {
        console.error('Error fetching community posts:', error);
        throw error;
      }

      // Check which posts the current user has liked
      if (posts && posts.length > 0) {
        const postIds = posts.map(post => post.id);
        const { data: likes } = await supabase
          .from('community_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);

        const likedPostIds = new Set(likes?.map(like => like.post_id) || []);

        // Add user_has_liked flag to each post
        const postsWithLikes = posts.map(post => ({
          ...post,
          user_has_liked: likedPostIds.has(post.id)
        }));

        return postsWithLikes;
      }
      
      return posts || [];
    },
    enabled: !!user?.id
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ content, imageUrls }: { content: string; imageUrls?: string[] }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get user's barangay
      const { data: profile } = await supabase
        .from('profiles')
        .select('barangay')
        .eq('id', user.id)
        .single();

      if (!profile?.barangay) throw new Error('User barangay not found');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          barangay_id: profile.barangay,
          content,
          image_urls: imageUrls || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      console.error('Create post error:', error);
    },
  });
};

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ['community-comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          *,
          profiles!community_comments_user_id_fkey (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!postId
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['community-comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
      console.error('Create comment error:', error);
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (!user?.id) throw new Error('User not authenticated');

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('community_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('community_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });
};
