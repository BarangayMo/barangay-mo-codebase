
import { Layout } from "@/components/layout/Layout";
import { CreatePostCard } from "@/components/community/CreatePostCard";
import { PostCard } from "@/components/community/PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import { useCommunityPosts } from "@/hooks/use-community-data";
import { useAuth } from "@/contexts/AuthContext";

const Community = () => {
  const { data: posts = [], isLoading } = useCommunityPosts();
  const { user } = useAuth();

  return (
    <Layout>
      <Helmet>
        <title>Community - Barangay Management System</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Community</h1>
            <p className="text-gray-600">Connect with your barangay community</p>
          </div>

          {/* Create Post */}
          {user && <CreatePostCard />}

          {/* Posts Feed */}
          <div className="space-y-0">
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex gap-3 mb-4">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500">
                    <h3 className="font-medium mb-2">No posts yet</h3>
                    <p className="text-sm">Be the first to share something with your community!</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
