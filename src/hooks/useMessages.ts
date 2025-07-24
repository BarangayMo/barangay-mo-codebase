
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  created_at: string;
  updated_at: string;
  is_read: boolean;
  read_at: string | null;
  metadata: any;
}

export interface Conversation {
  id: string;
  participant_one_id: string;
  participant_two_id: string;
  last_message_id: string | null;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  participant_one?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  participant_two?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  last_message?: Message;
  unread_count?: number;
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch conversations with participant details and unread counts
  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_one:profiles!participant_one_id(id, first_name, last_name, avatar_url),
          participant_two:profiles!participant_two_id(id, first_name, last_name, avatar_url),
          last_message:messages!last_message_id(id, content, created_at, sender_id, is_read)
        `)
        .or(`participant_one_id.eq.${user.id},participant_two_id.eq.${user.id}`)
        .eq('is_archived', false)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Calculate unread count for each conversation
      const conversationsWithUnreadCount = await Promise.all(
        (data || []).map(async (conv) => {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('recipient_id', user.id)
            .eq('is_read', false);

          return { ...conv, unread_count: count || 0 };
        })
      );

      setConversations(conversationsWithUnreadCount);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Cast the data to match our Message interface
      const typedMessages: Message[] = (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'text' | 'image' | 'file'
      }));

      setMessages(typedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive'
      });
    }
  };

  // Send a new message
  const sendMessage = async (conversationId: string, content: string, recipientId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: recipientId,
          content,
          message_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;

      // Cast the data to match our Message interface
      const typedMessage: Message = {
        ...data,
        message_type: data.message_type as 'text' | 'image' | 'file'
      };

      // Add message to local state
      setMessages(prev => [...prev, typedMessage]);
      
      // Refresh conversations to update last message
      fetchConversations();
      
      return typedMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  // Create or get existing conversation
  const getOrCreateConversation = async (participantId: string) => {
    if (!user) return null;

    try {
      // Check if conversation already exists
      const { data: existingConv, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(participant_one_id.eq.${user.id},participant_two_id.eq.${participantId}),and(participant_one_id.eq.${participantId},participant_two_id.eq.${user.id})`)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingConv) {
        return existingConv;
      }

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          participant_one_id: user.id,
          participant_two_id: participantId
        })
        .select()
        .single();

      if (createError) throw createError;

      // Refresh conversations
      fetchConversations();
      
      return newConv;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create conversation',
        variant: 'destructive'
      });
      return null;
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;

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

      if (error) throw error;

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.conversation_id === conversationId && msg.recipient_id === user.id
          ? { ...msg, is_read: true, read_at: new Date().toISOString() }
          : msg
      ));

      // Refresh conversations to update unread count
      fetchConversations();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Mark conversation as read/unread
  const toggleConversationReadStatus = async (conversationId: string, markAsRead: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          is_read: markAsRead,
          read_at: markAsRead ? new Date().toISOString() : null
        })
        .eq('conversation_id', conversationId)
        .eq('recipient_id', user.id);

      if (error) throw error;

      // Refresh conversations
      fetchConversations();
    } catch (error) {
      console.error('Error toggling conversation read status:', error);
    }
  };

  // Get total unread count
  const getUnreadCount = () => {
    return conversations.reduce((total, conv) => total + (conv.unread_count || 0), 0);
  };

  // Set up realtime subscriptions
  useEffect(() => {
    if (!user) return;

    fetchConversations();

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('New message received:', payload);
          fetchConversations();
          
          // If the message is for the currently selected conversation, add it to messages
          if (selectedConversation && payload.new.conversation_id === selectedConversation) {
            const typedMessage: Message = {
              ...payload.new,
              message_type: payload.new.message_type as 'text' | 'image' | 'file'
            };
            setMessages(prev => [...prev, typedMessage]);
          }
        }
      )
      .subscribe();

    // Subscribe to conversation updates
    const conversationSubscription = supabase
      .channel('conversations')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'conversations' 
        }, 
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
      conversationSubscription.unsubscribe();
    };
  }, [user, selectedConversation]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      markMessagesAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  return {
    conversations,
    messages,
    loading,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
    getOrCreateConversation,
    markMessagesAsRead,
    toggleConversationReadStatus,
    getUnreadCount,
    refreshConversations: fetchConversations
  };
};
