
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
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

export interface Conversation {
  id: string;
  participant_one_id: string;
  participant_two_id: string;
  last_message_id: string | null;
  last_message_at: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  last_message?: {
    content: string;
    sender_id: string;
    is_read: boolean;
    created_at: string;
  };
  other_participant?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  unread_count?: number;
}

export const useMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Fetch conversations with last message and participant info
  const fetchConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations' as any)
        .select(`
          *,
          last_message:messages!conversations_last_message_id_fkey(
            content,
            sender_id,
            is_read,
            created_at
          ),
          participant_one:profiles!conversations_participant_one_id_fkey(
            id,
            first_name,
            last_name,
            avatar_url
          ),
          participant_two:profiles!conversations_participant_two_id_fkey(
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .or(`participant_one_id.eq.${user.id},participant_two_id.eq.${user.id}`)
        .eq('is_archived', false)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Process conversations to add other participant and unread count
      const processedConversations = await Promise.all(
        (data || []).map(async (conv: any) => {
          const otherParticipant = conv.participant_one_id === user.id 
            ? conv.participant_two 
            : conv.participant_one;

          // Get unread count for this conversation
          const { count } = await supabase
            .from('messages' as any)
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('recipient_id', user.id)
            .eq('is_read', false);

          return {
            ...conv,
            other_participant: otherParticipant,
            unread_count: count || 0
          };
        })
      );

      setConversations(processedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages' as any)
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as Message[]);

      // Mark messages as read
      await markMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Create or find existing conversation
  const createOrFindConversation = async (participantId: string): Promise<string | null> => {
    if (!user) return null;

    try {
      // Check if conversation already exists
      const { data: existing, error: findError } = await supabase
        .from('conversations' as any)
        .select('id')
        .or(`and(participant_one_id.eq.${user.id},participant_two_id.eq.${participantId}),and(participant_one_id.eq.${participantId},participant_two_id.eq.${user.id})`)
        .single();

      if (existing) {
        return existing.id;
      }

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations' as any)
        .insert({
          participant_one_id: user.id,
          participant_two_id: participantId
        })
        .select('id')
        .single();

      if (createError) throw createError;
      return newConv.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  // Send a message
  const sendMessage = async (conversationId: string, content: string, recipientId: string) => {
    if (!user || !content.trim()) return false;

    try {
      const { error } = await supabase
        .from('messages' as any)
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: recipientId,
          content: content.trim(),
          message_type: 'text'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return false;
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages' as any)
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('conversation_id', conversationId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Mark conversation as read/unread
  const markConversationAsRead = async (conversationId: string, isRead: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages' as any)
        .update({ 
          is_read: isRead, 
          read_at: isRead ? new Date().toISOString() : null 
        })
        .eq('conversation_id', conversationId)
        .eq('recipient_id', user.id);

      if (error) throw error;
      
      // Refresh conversations
      await fetchConversations();
      
      toast({
        title: "Success",
        description: `Conversation marked as ${isRead ? 'read' : 'unread'}`,
      });
    } catch (error) {
      console.error('Error updating conversation read status:', error);
      toast({
        title: "Error",
        description: "Failed to update conversation status",
        variant: "destructive"
      });
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Filter conversations based on selected filter
  const filteredConversations = conversations.filter(conv => {
    if (filter === 'unread') {
      return (conv.unread_count || 0) > 0;
    }
    if (filter === 'read') {
      return (conv.unread_count || 0) === 0;
    }
    return true;
  });

  return {
    conversations: filteredConversations,
    messages,
    loading,
    filter,
    setFilter,
    fetchConversations,
    fetchMessages,
    createOrFindConversation,
    sendMessage,
    markConversationAsRead
  };
};
