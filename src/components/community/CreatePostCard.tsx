
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCreatePost } from "@/hooks/use-community-data";

export const CreatePostCard = () => {
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const createPost = useCreatePost();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    await createPost.mutateAsync({
      content: content.trim()
    });
    
    setContent("");
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
            <AvatarFallback>
              {user?.user_metadata?.first_name?.[0]}{user?.user_metadata?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] resize-none border-none shadow-none p-0 text-sm placeholder:text-gray-400"
            />
            
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <Image className="h-4 w-4 mr-2" />
                Photo
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || createPost.isPending}
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
