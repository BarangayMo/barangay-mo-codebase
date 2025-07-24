
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react';
import { useMessages, type Conversation } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

export function ChatInterface() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const { messages, fetchMessages, sendMessage } = useMessages();
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      fetchConversationDetails();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up real-time subscription for this conversation
  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = supabase
      .channel(`conversation_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          fetchMessages(conversationId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  const fetchConversationDetails = async () => {
    if (!conversationId || !user) return;

    try {
      const { data: convData, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      const otherParticipantId = convData.participant_one_id === user.id 
        ? convData.participant_two_id 
        : convData.participant_one_id;

      // Get other participant info
      const { data: participantData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', otherParticipantId)
        .single();

      setConversation({
        ...convData,
        other_participant: participantData
      } as Conversation);
    } catch (error) {
      console.error('Error fetching conversation details:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !conversation || sending) return;

    setSending(true);
    const recipientId = conversation.participant_one_id === user?.id 
      ? conversation.participant_two_id 
      : conversation.participant_one_id;

    const success = await sendMessage(conversationId, newMessage, recipientId);
    
    if (success) {
      setNewMessage('');
    }
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat header */}
      <div className="flex items-center space-x-3 p-4 border-b">
        <Button variant="ghost" size="icon" asChild className="md:hidden">
          <Link to="/messages">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        
        <Avatar className="w-10 h-10">
          <AvatarImage 
            src={conversation.other_participant?.avatar_url || ''} 
            alt={`${conversation.other_participant?.first_name} ${conversation.other_participant?.last_name}`}
          />
          <AvatarFallback>
            {conversation.other_participant?.first_name?.charAt(0)}
            {conversation.other_participant?.last_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">
            {conversation.other_participant?.first_name} {conversation.other_participant?.last_name}
          </h2>
          <p className="text-sm text-gray-500">Active now</p>
        </div>
        
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 px-4 py-2" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isOwn = message.sender_id === user?.id;
            const showAvatar = !isOwn && (index === 0 || messages[index - 1].sender_id !== message.sender_id);

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} space-x-2`}
              >
                {!isOwn && (
                  <Avatar className={`w-8 h-8 ${showAvatar ? 'visible' : 'invisible'}`}>
                    <AvatarImage 
                      src={conversation.other_participant?.avatar_url || ''} 
                      alt={`${conversation.other_participant?.first_name} ${conversation.other_participant?.last_name}`}
                    />
                    <AvatarFallback className="text-xs">
                      {conversation.other_participant?.first_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isOwn
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    {isOwn && !message.is_read && <span className="ml-1">•</span>}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="p-4 border-t">
        <div className="flex items-end space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 min-h-[40px] resize-none"
            disabled={sending}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            size="icon"
            className="h-10 w-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
