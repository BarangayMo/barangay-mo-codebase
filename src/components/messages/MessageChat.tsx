
import { useState } from "react";
import { ArrowLeft, Send, Smile, Paperclip, Mic, MoreVertical } from "lucide-react"; // Added Paperclip, Mic, MoreVertical
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserConversation, ChatMessage, chatHistory as allChatHistory } from "@/data/conversations";
import { cn } from "@/lib/utils";

interface MessageChatProps {
  selectedConversation: UserConversation | null;
  onBack?: () => void; // For mobile view to go back to list
}

export function MessageChat({ selectedConversation, onBack }: MessageChatProps) {
  const [newMessage, setNewMessage] = useState("");
  // This is a local state for messages for demonstration.
  // In a real app, this would come from a global state or be part of allChatHistory and updated.
  const [messages, setMessages] = useState<ChatMessage[]>(
    selectedConversation ? allChatHistory[selectedConversation.id] || [] : []
  );

  // Update messages when selectedConversation changes
  useState(() => {
    setMessages(selectedConversation ? allChatHistory[selectedConversation.id] || [] : []);
  }, [selectedConversation]);


  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const messageToSend: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true,
    };
    
    // locally update messages for this demo
    setMessages(prev => [...prev, messageToSend]);
    // In a real app, you would also update the allChatHistory or send to a backend
    // e.g., allChatHistory[selectedConversation.id].push(messageToSend);
    
    setNewMessage("");
  };

  if (!selectedConversation) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 md:rounded-r-lg">
        <Smile size={48} className="text-gray-300 mb-4" /> {/* Using Smile as placeholder */}
        <p className="text-gray-500">Select a conversation to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50 md:rounded-r-lg h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white md:rounded-tr-lg">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
          <AvatarFallback>{selectedConversation.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-800">{selectedConversation.name}</h2>
          {selectedConversation.online && <p className="text-xs text-green-500">Online</p>}
        </div>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex flex-col", message.sent ? "items-end" : "items-start")}
          >
            <div className="flex items-end gap-2 max-w-[75%]">
              {!message.sent && (
                <Avatar className="w-6 h-6 mb-1 flex-shrink-0">
                  <AvatarImage src={selectedConversation.avatar} />
                  <AvatarFallback>{selectedConversation.name.substring(0,1)}</AvatarFallback>
                </Avatar>
              )}
              {message.text ? (
                <div
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm",
                    message.sent
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                  )}
                >
                  {message.text}
                </div>
              ) : message.audioUrl ? ( // Basic audio message display
                <div className={cn("bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm", message.sent ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-700")}>
                  {/* Basic audio placeholder */}
                  <Smile className="w-4 h-4" /> 
                  <span className="text-xs">Audio: {message.duration}</span>
                </div>
              ) : null}
            </div>
             <span className={cn("text-xs text-gray-400 mt-1", message.sent ? "mr-0" : "ml-8")}>{message.time}</span>
          </div>
        ))}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-white md:rounded-br-lg">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-500">
            <Smile className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-2 px-2"
            onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
          />
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-500">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon" className="bg-blue-500 hover:bg-blue-600 text-white rounded-md w-8 h-8">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
