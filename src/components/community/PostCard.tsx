
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CommunityPost, usePostComments, useCreateComment, useToggleLike } from "@/hooks/use-community-data";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PostCardProps {
  post: CommunityPost;
}

export const PostCard = ({ post }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [optimisticLiked, setOptimisticLiked] = useState(post.user_has_liked);
  const [optimisticLikesCount, setOptimisticLikesCount] = useState(post.likes_count);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: comments = [], isLoading: commentsLoading } = usePostComments(showComments ? post.id : "");
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
    if (!user?.id) return;
    
    // Optimistic update
    const wasLiked = optimisticLiked;
    setOptimisticLiked(!wasLiked);
    setOptimisticLikesCount(prev => wasLiked ? prev - 1 : prev + 1);
    
    try {
      await toggleLike.mutateAsync({
        postId: post.id,
        isLiked: wasLiked || false
      });
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticLiked(wasLiked);
      setOptimisticLikesCount(post.likes_count);
      console.error('Error toggling like:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Community Post by ${getPostAuthorName()}`,
      text: post.content,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(`${post.content}\n\n${window.location.href}`);
        toast({
          title: "Copied to clipboard",
          description: "Post content and link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Final fallback - just copy the content
      try {
        await navigator.clipboard.writeText(post.content);
        toast({
          title: "Copied to clipboard",
          description: "Post content copied to clipboard",
        });
      } catch (clipboardError) {
        toast({
          title: "Share failed",
          description: "Unable to share or copy content",
          variant: "destructive",
        });
      }
    }
  };

  const getPostAuthorName = () => {
    const firstName = post.profiles?.first_name;
    const lastName = post.profiles?.last_name;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) return firstName;
    if (lastName) return lastName;
    return "User";
  };

  const getPostAuthorInitials = () => {
    const firstName = post.profiles?.first_name;
    const lastName = post.profiles?.last_name;
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    if (lastName) {
      return lastName.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getCurrentUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    }
    if (user?.lastName) {
      return user.lastName.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <Card className="mb-3 border-gray-200 shadow-sm">
      <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.profiles?.avatar_url || ""} />
              <AvatarFallback className="bg-blue-500 text-white">
                {getPostAuthorInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm text-gray-900">
                {getPostAuthorName()}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="mb-3">
          <p className="text-gray-800 text-sm leading-relaxed">{post.content}</p>
          
          {/* Images */}
          {post.image_urls && post.image_urls.length > 0 && (
            <div className="mt-3 rounded-lg overflow-hidden">
              {post.image_urls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {/* Engagement Stats */}
        {(optimisticLikesCount > 0 || post.comments_count > 0) && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100 mb-2">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {optimisticLikesCount > 0 && (
                <span>{optimisticLikesCount} {optimisticLikesCount === 1 ? 'like' : 'likes'}</span>
              )}
              {post.comments_count > 0 && (
                <span onClick={() => setShowComments(!showComments)} className="cursor-pointer hover:underline">
                  {post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 ${optimisticLiked ? 'text-red-500' : 'text-gray-600'}`}
          >
            <Heart className={`h-4 w-4 ${optimisticLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">Like</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Comment</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Share className="h-4 w-4" />
            <span className="text-sm font-medium">Share</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {/* Add Comment */}
            {user && (
              <div className="flex gap-2 mb-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.avatar || ""} />
                  <AvatarFallback className="text-xs bg-blue-500 text-white">
                    {getCurrentUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    className="h-8 text-sm rounded-full bg-gray-100 border-gray-200"
                  />
                  <Button
                    size="sm"
                    onClick={handleComment}
                    disabled={!commentText.trim() || createComment.isPending}
                    className="h-8 px-3 bg-blue-600 hover:bg-blue-700"
                  >
                    Post
                  </Button>
                </div>
              </div>
            )}

            {/* Comments List */}
            {commentsLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-lg h-12 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map((comment) => {
                  const commentAuthorName = () => {
                    const firstName = comment.profiles?.first_name;
                    const lastName = comment.profiles?.last_name;
                    if (firstName && lastName) {
                      return `${firstName} ${lastName}`;
                    }
                    if (firstName) return firstName;
                    if (lastName) return lastName;
                    return "User";
                  };

                  const commentAuthorInitials = () => {
                    const firstName = comment.profiles?.first_name;
                    const lastName = comment.profiles?.last_name;
                    if (firstName && lastName) {
                      return `${firstName[0]}${lastName[0]}`.toUpperCase();
                    }
                    if (firstName) {
                      return firstName.substring(0, 2).toUpperCase();
                    }
                    if (lastName) {
                      return lastName.substring(0, 2).toUpperCase();
                    }
                    return "U";
                  };

                  return (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={comment.profiles?.avatar_url || ""} />
                        <AvatarFallback className="text-xs bg-blue-500 text-white">
                          {commentAuthorInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-100 rounded-2xl px-3 py-2">
                          <p className="font-semibold text-xs text-gray-900">
                            {commentAuthorName()}
                          </p>
                          <p className="text-sm text-gray-800 break-words">{comment.content}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 ml-3">
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </p>
                          <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No comments yet</p>
                <p className="text-xs">Be the first to comment!</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
