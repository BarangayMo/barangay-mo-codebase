
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useCommunityPosts } from "@/hooks/use-community-data";

export const CommunitySlider = () => {
  const { data: posts = [], isLoading } = useCommunityPosts(3);

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
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={post.profiles?.avatar_url || ""} />
                  <AvatarFallback className="text-xs">
                    {post.profiles?.first_name?.[0]}{post.profiles?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {post.profiles?.first_name} {post.profiles?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 flex-shrink-0">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{post.likes_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{post.comments_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No community posts yet</p>
              <p className="text-xs mt-1">Be the first to share something!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
