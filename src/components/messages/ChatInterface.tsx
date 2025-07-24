import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: any;
}

interface Conversation {
  id: string;
  participant_one_id: string;
  participant_two_id: string;
  last_message_id: string | null;
  last_message_at: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  other_participant?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export function ChatInterface() {
  const { id: conversationId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId && user) {
      console.log('Loading conversation and messages for ID:', conversationId);
      loadConversationAndMessages();
    } else {
      setLoading(false);
      setError('Missing conversation ID or user authentication');
    }
  }, [conversationId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up real-time subscription for this conversation
  useEffect(() => {
    if (!conversationId || !user) return;

    console.log('Setting up real-time subscription for conversation:', conversationId);
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
          console.log('New message received, refreshing messages...');
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  const loadConversationAndMessages = async () => {
    if (!conversationId || !user) return;

    setLoading(true);
    setError(null);

    try {
      // First, fetch and validate the conversation
      console.log('Fetching conversation details...');
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .maybeSingle();

      if (convError) {
        console.error('Error fetching conversation:', convError);
        throw new Error('Failed to load conversation details');
      }

      if (!convData) {
        setError('Conversation not found');
        return;
      }

      // Check if user is a participant
      const isParticipant = 
        convData.participant_one_id === user.id || 
        convData.participant_two_id === user.id;

      if (!isParticipant) {
        setError('You are not authorized to view this conversation');
        return;
      }

      // Get other participant info
      const otherParticipantId = 
        convData.participant_one_id === user.id 
          ? convData.participant_two_id 
          : convData.participant_one_id;

      console.log('Fetching other participant info for ID:', otherParticipantId);
      const { data: participantData, error: participantError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', otherParticipantId)
        .maybeSingle();

      if (participantError) {
        console.error('Error fetching participant:', participantError);
        throw new Error('Failed to load participant information');
      }

      if (!participantData) {
        console.warn('Participant not found, using placeholder');
      }

      setConversation({
        ...convData,
        other_participant: participantData || {
          id: otherParticipantId,
          first_name: 'Unknown',
          last_name: 'User',
          avatar_url: null
        }
      });

      // Now fetch messages
      await fetchMessages();

    } catch (error: any) {
      console.error('Error in loadConversationAndMessages:', error);
      setError(error.message || 'Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!conversationId || !user) return;

    try {
      console.log('Fetching messages for conversation:', conversationId);
      
      // Fetch messages where user is either sender or recipient
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        throw messagesError;
      }

      console.log('Fetched messages:', messagesData?.length || 0);
      setMessages(messagesData || []);

      // Mark unread messages as read
      if (messagesData && messagesData.length > 0) {
        await markMessagesAsRead();
      }

    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const markMessagesAsRead = async () => {
    if (!conversationId || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('conversation_id', conversationId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking messages as read:', error);
      }
    } catch (error) {
      console.error('Error in markMessagesAsRead:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !conversation || sending || !user) return;

    setSending(true);
    const recipientId = conversation.participant_one_id === user.id 
      ? conversation.participant_two_id 
      : conversation.participant_one_id;

    try {
      console.log('Sending message to:', recipientId);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: recipientId,
          content: newMessage.trim(),
          message_type: 'text'
        });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
      
      setNewMessage('');
      // Refresh messages after sending
      await fetchMessages();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToJobs = () => {
    // Check if user came from jobs page by checking the referrer or use a more sophisticated routing solution
    const referrer = document.referrer;
    if (referrer && referrer.includes('/jobs')) {
      navigate('/jobs');
    } else {
      navigate('/jobs');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={() => loadConversationAndMessages()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600">Conversation not found</p>
          <Button variant="outline" onClick={() => loadConversationAndMessages()} className="mt-4">
            Reload
          </Button>
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
        
        {/* Add back to jobs button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleBackToJobs}
          className="hidden md:flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Button>
        
        <Avatar className="w-10 h-10">
          <AvatarImage 
            src={conversation?.other_participant?.avatar_url || ''} 
            alt={`${conversation?.other_participant?.first_name} ${conversation?.other_participant?.last_name}`}
          />
          <AvatarFallback>
            {conversation?.other_participant?.first_name?.charAt(0) || 'U'}
            {conversation?.other_participant?.last_name?.charAt(0) || ''}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">
            {conversation?.other_participant?.first_name || 'Unknown'} {conversation?.other_participant?.last_name || 'User'}
          </h2>
          <p className="text-sm text-gray-500">Active now</p>
        </div>
        
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => {
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
                        {conversation.other_participant?.first_name?.charAt(0) || 'U'}
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
            })
          )}
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
