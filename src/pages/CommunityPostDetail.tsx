
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/community/PostCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CommunityPost } from "@/hooks/use-community-data";

const CommunityPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['community-post', postId],
    queryFn: async () => {
      if (!postId || !user?.id) return null;

      // Get user's barangay
      const { data: profile } = await supabase
        .from('profiles')
        .select('barangay')
        .eq('id', user.id)
        .single();

      if (!profile?.barangay) return null;

      // Fetch the specific post
      const { data: postData, error: postError } = await supabase
        .from('community_posts')
        .select('*')
        .eq('id', postId)
        .eq('barangay_id', profile.barangay)
        .single();

      if (postError) throw postError;
      if (!postData) return null;

      // Fetch profile for the post author
      const { data: authorProfile } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', postData.user_id)
        .single();

      // Check if current user has liked this post
      const { data: likes } = await supabase
        .from('community_likes')
        .select('post_id')
        .eq('user_id', user.id)
        .eq('post_id', postId);

      const userHasLiked = likes && likes.length > 0;

      return {
        ...postData,
        profiles: authorProfile,
        user_has_liked: userHasLiked
      } as CommunityPost;
    },
    enabled: !!postId && !!user?.id
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-8">
            <p className="text-gray-500">Post not found or you don't have access to it.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <PostCard post={post} />
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
