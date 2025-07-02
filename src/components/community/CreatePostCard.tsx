
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, Smile, MapPin, Users, Palette } from "lucide-react";
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

  return (
    <Card className="mb-4 border-gray-200">
      <CardContent className="p-3">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={""} />
            <AvatarFallback className="text-xs bg-gray-300">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div 
              className={`border border-gray-300 rounded-full px-4 py-2 cursor-text bg-gray-50 transition-all ${isExpanded ? 'rounded-lg' : ''}`}
              onClick={handleFocus}
            >
              {!isExpanded ? (
                <p className="text-gray-500 text-sm">What's on your mind?</p>
              ) : (
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[60px] resize-none border-none shadow-none p-0 text-sm placeholder:text-gray-400 bg-transparent"
                  autoFocus
                />
              )}
            </div>
            
            {isExpanded && (
              <div className="mt-3 space-y-3">
                {/* Action buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 h-auto">
                      <Image className="h-5 w-5 mr-1" />
                      <span className="text-xs">Photo</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 h-auto">
                      <Video className="h-5 w-5 mr-1" />
                      <span className="text-xs">Video</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 h-auto">
                      <Smile className="h-5 w-5 mr-1" />
                      <span className="text-xs">Feeling</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 h-auto">
                      <MapPin className="h-5 w-5 mr-1" />
                      <span className="text-xs">Check in</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 h-auto">
                      <Palette className="h-5 w-5 mr-1" />
                      <span className="text-xs">Background</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 h-auto">
                      <Users className="h-5 w-5 mr-1" />
                      <span className="text-xs">Tag friends</span>
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={!content.trim() || createPost.isPending}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                  >
                    Post
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
