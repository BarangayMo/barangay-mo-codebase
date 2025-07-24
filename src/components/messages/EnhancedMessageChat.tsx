
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Smile, Paperclip, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessages, type Conversation } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface EnhancedMessageChatProps {
  conversationId: string;
  onBack?: () => void;
}

export function EnhancedMessageChat({ conversationId, onBack }: EnhancedMessageChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, conversations } = useMessages();
  const { user } = useAuth();

  // Find the conversation details
  useEffect(() => {
    const conv = conversations.find(c => c.id === conversationId);
    setConversation(conv || null);
  }, [conversationId, conversations]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation) return;

    const otherParticipant = conversation.participant_one_id === user?.id 
      ? conversation.participant_two 
      : conversation.participant_one;

    if (!otherParticipant) return;

    await sendMessage(conversationId, newMessage, otherParticipant.id);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading conversation...</p>
        </div>
      </div>
    );
  }

  const otherParticipant = conversation.participant_one_id === user?.id 
    ? conversation.participant_two 
    : conversation.participant_one;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <Avatar className="w-10 h-10">
          <AvatarImage src={otherParticipant?.avatar_url} />
          <AvatarFallback>
            {`${otherParticipant?.first_name?.charAt(0) || ''}${otherParticipant?.last_name?.charAt(0) || ''}`}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="font-semibold text-gray-800">
            {`${otherParticipant?.first_name || ''} ${otherParticipant?.last_name || ''}`.trim() || 'Unknown User'}
          </h2>
          <p className="text-xs text-gray-500">
            Last seen {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
          </p>
        </div>
        
        <Button variant="ghost" size="icon" className="text-gray-500">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isSent = message.sender_id === user?.id;
              const showAvatar = !isSent;
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2 max-w-[85%]",
                    isSent ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  {showAvatar && (
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarImage src={otherParticipant?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {otherParticipant?.first_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={cn("flex flex-col", isSent ? "items-end" : "items-start")}>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2 max-w-full break-words",
                        isSent
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-1 mt-1 text-xs text-gray-400",
                      isSent ? "flex-row-reverse" : ""
                    )}>
                      <span>
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                      {isSent && (
                        <span className={cn(
                          "text-xs",
                          message.is_read ? "text-blue-500" : "text-gray-400"
                        )}>
                          {message.is_read ? "Read" : "Sent"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2 bg-gray-50 rounded-full p-2">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-500">
            <Smile className="w-5 h-5" />
          </Button>
          
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-500">
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
