
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useCommunityPosts } from "@/hooks/use-community-data";
import { useState } from "react";

export const CommunitySlider = () => {
  const { data: posts = [], isLoading } = useCommunityPosts(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/community/post/${postId}`);
  };

  if (isLoading) {
    return (
      <Card className="mt-6 bg-white shadow-sm border border-gray-100">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="mt-6 bg-white shadow-sm border border-gray-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-900">
              Community Posts
            </CardTitle>
            <Link to="/community" className="text-red-500 text-sm font-medium hover:text-red-600">
              View All
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">No community posts yet</p>
            <p className="text-xs mt-1">Be the first to share something!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 bg-white shadow-sm border border-gray-100">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            Community Posts
          </CardTitle>
          <Link to="/community" className="text-red-500 text-sm font-medium hover:text-red-600">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          {/* Navigation buttons */}
          {posts.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Current post */}
          <div 
            className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors mx-8"
            onClick={() => handlePostClick(posts[currentIndex].id)}
          >
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={posts[currentIndex].profiles?.avatar_url || ""} />
                <AvatarFallback className="text-xs">
                  {posts[currentIndex].profiles?.first_name?.[0] || 'U'}{posts[currentIndex].profiles?.last_name?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {posts[currentIndex].profiles?.first_name || 'User'} {posts[currentIndex].profiles?.last_name || ''}
                  </p>
                  <p className="text-xs text-gray-500 flex-shrink-0">
                    {formatDistanceToNow(new Date(posts[currentIndex].created_at), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                  {posts[currentIndex].content}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{posts[currentIndex].likes_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{posts[currentIndex].comments_count}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          {posts.length > 1 && (
            <div className="flex justify-center mt-3 gap-1">
              {posts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
