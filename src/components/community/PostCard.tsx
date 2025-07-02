
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CommunityPost, usePostComments, useCreateComment, useToggleLike } from "@/hooks/use-community-data";
import { useAuth } from "@/contexts/AuthContext";

interface PostCardProps {
  post: CommunityPost;
}

export const PostCard = ({ post }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  
  const { data: comments = [] } = usePostComments(showComments ? post.id : "");
  const createComment = useCreateComment();
  const toggleLike = useToggleLike();

  const handleComment = async () => {
    if (!commentText.trim()) return;
    
    await createComment.mutateAsync({
      postId: post.id,
      content: commentText.trim()
    });
    
    setCommentText("");
  };

  const handleLike = async () => {
    await toggleLike.mutateAsync({
      postId: post.id,
      isLiked
    });
    setIsLiked(!isLiked);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.profiles?.avatar_url || ""} />
            <AvatarFallback>
              {post.profiles?.first_name?.[0]}{post.profiles?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm">
              {post.profiles?.first_name} {post.profiles?.last_name}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-800 text-sm leading-relaxed">{post.content}</p>
          
          {/* Images */}
          {post.image_urls && post.image_urls.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {post.image_urls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Post image ${index + 1}`}
                  className="rounded-lg w-full h-32 object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{post.likes_count}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-600"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.comments_count}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
            <Share className="h-4 w-4" />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {/* Add Comment */}
            <div className="flex gap-2 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="h-8 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleComment}
                  disabled={!commentText.trim() || createComment.isPending}
                  className="h-8"
                >
                  Post
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={comment.profiles?.avatar_url || ""} />
                    <AvatarFallback className="text-xs">
                      {comment.profiles?.first_name?.[0]}{comment.profiles?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="font-medium text-xs">
                        {comment.profiles?.first_name} {comment.profiles?.last_name}
                      </p>
                      <p className="text-sm text-gray-800">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
