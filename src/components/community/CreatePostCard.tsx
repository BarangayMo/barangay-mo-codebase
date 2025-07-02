
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, Smile, MapPin, Users, Palette } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useAuth } from "@/contexts/AuthContext";
import { useCreatePost } from "@/hooks/use-community-data";

export const CreatePostCard = () => {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const createPost = useCreatePost();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    await createPost.mutateAsync({
      content: content.trim()
    });
    
    setContent("");
    setIsExpanded(false);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Only collapse if we're not clicking on action buttons or the text area itself
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      if (!content.trim()) {
        setIsExpanded(false);
      }
    }
  };

  const actionButtons = [
    { icon: Image, label: "Photo", color: "text-green-600" },
    { icon: Video, label: "Video", color: "text-blue-600" },
    { icon: Smile, label: "Feeling", color: "text-yellow-600" },
    { icon: MapPin, label: "Check in", color: "text-red-600" },
    { icon: Palette, label: "Background", color: "text-purple-600" },
    { icon: Users, label: "Tag friends", color: "text-indigo-600" }
  ];

  // Get user's name from either user profile or email
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.lastName) {
      return user.lastName;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
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

  const getUserAvatarUrl = () => {
    return user?.avatar || "";
  };

  return (
    <Card className="mb-4 border-gray-200">
      <CardContent className="p-3">
        <div 
          className="flex gap-3"
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {/* Hide Avatar when expanded */}
          {!isExpanded && (
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={getUserAvatarUrl()} />
              <AvatarFallback className="text-xs bg-blue-500 text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={`${isExpanded ? 'w-full' : 'flex-1'} min-w-0`}>
            {!isExpanded ? (
              <div 
                className="border border-gray-300 rounded-full px-4 py-2 cursor-text bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={handleFocus}
                tabIndex={0}
              >
                <p className="text-gray-500 text-sm">What's on your mind?</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Show user info when expanded */}
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getUserAvatarUrl()} />
                    <AvatarFallback className="text-xs bg-blue-500 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-900">{getUserDisplayName()}</span>
                </div>

                <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                  <Textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[60px] resize-none border-none shadow-none p-0 text-sm placeholder:text-gray-400 bg-transparent focus:ring-0"
                    autoFocus
                  />
                </div>
                
                {/* Slidable Action buttons */}
                <div className="w-full">
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-2">
                      {actionButtons.map((button, index) => (
                        <CarouselItem key={index} className="basis-auto pl-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${button.color} hover:bg-gray-100 h-10 px-3 rounded-full border border-gray-200 bg-white shadow-sm`}
                          >
                            <button.icon className="h-4 w-4 mr-2" />
                            <span className="text-xs font-medium">{button.label}</span>
                          </Button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
                
                <div className="flex justify-end pt-2 border-t border-gray-200">
                  <Button
                    onClick={handleSubmit}
                    disabled={!content.trim() || createPost.isPending}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                  >
                    {createPost.isPending ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
