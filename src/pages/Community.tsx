import { Layout } from "@/components/layout/Layout";
import { CreatePostCard } from "@/components/community/CreatePostCard";
import { PostCard } from "@/components/community/PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useCommunityPosts } from "@/hooks/use-community-data";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Community = () => {
  const { data: posts = [], isLoading } = useCommunityPosts();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  // Dynamic styling based on user role
  const isOfficial = userRole === 'official';
  const headerClass = isOfficial ? 'bg-official text-white' : 'bg-red-600 text-white';
  const hoverClass = isOfficial ? 'hover:bg-official-dark' : 'hover:bg-red-700';
  const titleColor = isOfficial ? 'text-official' : 'text-gray-900';

  return (
    <>
      <Helmet>
        <title>Community - Barangay Management System</title>
      </Helmet>
      
      {/* Mobile Header - moved to very top */}
      {isMobile && (
        <div className={`fixed top-0 left-0 right-0 z-50 ${headerClass}`}>
          <div className="flex items-center gap-3 px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className={`text-white ${hoverClass} p-1 h-8 w-8`}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Community</h1>
          </div>
        </div>
      )}

      <Layout hideHeader={isMobile}>
        <div className="min-h-screen bg-gray-50">
          <div className={`max-w-2xl mx-auto px-4 py-4 ${isMobile ? 'pt-16' : ''}`}>
            {/* Desktop Header */}
            {!isMobile && (
              <div className="mb-6">
                <h1 className={`text-2xl font-bold ${titleColor} mb-2`}>Community</h1>
                <p className="text-gray-600">
                  {isOfficial 
                    ? "Connect with your barangay community as an official" 
                    : "Connect with your barangay community"
                  }
                </p>
              </div>
            )}

            {/* Create Post */}
            {user && <CreatePostCard />}

            {/* Posts Feed */}
            <div className="space-y-0">
              {isLoading ? (
                // Loading skeleton
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex gap-3 mb-3">
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
                <Card className="border-gray-200">
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
    </>
  );
};

export default Community;
