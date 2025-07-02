
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
  } | null;
  user_has_liked?: boolean;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
  replies?: CommunityComment[];
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

      // Fetch posts without profile join
      let query = supabase
        .from('community_posts')
        .select('*')
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

      if (!posts || posts.length === 0) {
        return [];
      }

      // Get unique user IDs from posts
      const userIds = [...new Set(posts.map(post => post.user_id))];
      
      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue without profiles if there's an error
      }

      // Create a map of user_id to profile
      const profileMap = new Map();
      if (profiles) {
        profiles.forEach(profile => {
          profileMap.set(profile.id, profile);
        });
      }

      // Check which posts the current user has liked
      const postIds = posts.map(post => post.id);
      const { data: likes } = await supabase
        .from('community_likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds);

      const likedPostIds = new Set(likes?.map(like => like.post_id) || []);

      // Combine posts with their profiles
      const postsWithProfiles = posts.map(post => ({
        ...post,
        profiles: profileMap.get(post.user_id) || null,
        user_has_liked: likedPostIds.has(post.id)
      }));

      return postsWithProfiles;
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
      // Fetch comments without profile join
      const { data: comments, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      if (!comments || comments.length === 0) {
        return [];
      }

      // Get unique user IDs from comments
      const userIds = [...new Set(comments.map(comment => comment.user_id))];
      
      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue without profiles if there's an error
      }

      // Create a map of user_id to profile
      const profileMap = new Map();
      if (profiles) {
        profiles.forEach(profile => {
          profileMap.set(profile.id, profile);
        });
      }

      // Combine comments with their profiles
      const commentsWithProfiles = comments.map(comment => ({
        ...comment,
        profiles: profileMap.get(comment.user_id) || null,
        replies: []
      }));

      // Organize comments into threads
      const commentMap = new Map();
      const topLevelComments: CommunityComment[] = [];

      // First pass: create comment objects
      commentsWithProfiles.forEach(comment => {
        const commentWithReplies = { ...comment, replies: [] };
        commentMap.set(comment.id, commentWithReplies);
        
        if (!comment.parent_comment_id) {
          topLevelComments.push(commentWithReplies);
        }
      });

      // Second pass: organize replies
      commentsWithProfiles.forEach(comment => {
        if (comment.parent_comment_id) {
          const parentComment = commentMap.get(comment.parent_comment_id);
          if (parentComment) {
            parentComment.replies.push(commentMap.get(comment.id));
          }
        }
      });

      return topLevelComments;
    },
    enabled: !!postId
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, content, parentCommentId }: { postId: string; content: string; parentCommentId?: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
          parent_comment_id: parentCommentId || null
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
