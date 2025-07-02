
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

  const handleBlur = (e: React.FocusEvent) => {
    // Only collapse if we're not clicking on action buttons or the text area itself
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      if (!content.trim()) {
        setIsExpanded(false);
      }
    }
  };

  return (
    <Card className="mb-4 border-gray-200">
      <CardContent className="p-3">
        <div 
          className="flex gap-3"
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={""} />
            <AvatarFallback className="text-xs bg-gray-300">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
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
                <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                  <Textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[60px] resize-none border-none shadow-none p-0 text-sm placeholder:text-gray-400 bg-transparent focus:ring-0"
                    autoFocus
                  />
                </div>
                
                {/* Action buttons - Mobile responsive */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 h-8 justify-start">
                      <Image className="h-4 w-4 mr-1" />
                      <span className="text-xs">Photo</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 h-8 justify-start">
                      <Video className="h-4 w-4 mr-1" />
                      <span className="text-xs">Video</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 h-8 justify-start">
                      <Smile className="h-4 w-4 mr-1" />
                      <span className="text-xs">Feeling</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 h-8 justify-start">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-xs">Check in</span>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 h-8 justify-start">
                      <Palette className="h-4 w-4 mr-1" />
                      <span className="text-xs">Background</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 h-8 justify-start">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-xs">Tag friends</span>
                    </Button>
                  </div>
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
