
import { Search } from "lucide-react";
import { MessageListItem } from "./MessageListItem";
import { useNavigate } from "react-router-dom";
import { conversations as allConversations, UserConversation } from "@/data/conversations"; // Import new data
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MessageListProps {
  activeConversationId?: string;
  onConversationSelect: (id: string) => void;
}

export function MessageList({ activeConversationId, onConversationSelect }: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = allConversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white md:rounded-l-lg">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Messages</h1>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-50 focus:bg-white"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredConversations.map((conversation) => (
            <MessageListItem 
              key={conversation.id} 
              {...conversation} 
              isActive={conversation.id === activeConversationId}
              onClick={() => onConversationSelect(conversation.id)}
            />
          ))}
          {filteredConversations.length === 0 && (
            <p className="text-center text-gray-500 py-4 text-sm">No conversations found.</p>
          )}
        </div>
      </ScrollArea>

      {/* Plus button removed as per admin page design, can be added back if needed */}
    </div>
  );
}
