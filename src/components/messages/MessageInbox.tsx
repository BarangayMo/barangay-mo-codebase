
import { useState, useMemo } from 'react';
import { Search, Filter, Check, MarkAsUnread } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMessages, type Conversation } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface MessageInboxProps {
  onConversationSelect: (conversationId: string) => void;
  activeConversationId?: string;
}

type FilterType = 'all' | 'unread' | 'read';

export function MessageInbox({ onConversationSelect, activeConversationId }: MessageInboxProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const { conversations, loading, toggleConversationReadStatus } = useMessages();
  const { user } = useAuth();

  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(conv => {
        const otherParticipant = conv.participant_one_id === user?.id 
          ? conv.participant_two 
          : conv.participant_one;
        const name = `${otherParticipant?.first_name || ''} ${otherParticipant?.last_name || ''}`.toLowerCase();
        return name.includes(searchQuery.toLowerCase());
      });
    }

    // Apply read/unread filter
    if (filterType === 'unread') {
      filtered = filtered.filter(conv => (conv.unread_count || 0) > 0);
    } else if (filterType === 'read') {
      filtered = filtered.filter(conv => (conv.unread_count || 0) === 0);
    }

    return filtered;
  }, [conversations, searchQuery, filterType, user?.id]);

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participant_one_id === user?.id 
      ? conversation.participant_two 
      : conversation.participant_one;
  };

  const handleMarkAsRead = async (conversationId: string, isRead: boolean) => {
    await toggleConversationReadStatus(conversationId, isRead);
  };

  const getFilterLabel = (type: FilterType) => {
    switch (type) {
      case 'all': return 'All Messages';
      case 'unread': return 'Unread';
      case 'read': return 'Read';
      default: return 'All Messages';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Messages</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                {getFilterLabel(filterType)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                All Messages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('unread')}>
                Unread Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('read')}>
                Read Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {searchQuery ? 'No conversations found.' : 'No messages yet.'}
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const isActive = activeConversationId === conversation.id;
              const hasUnread = (conversation.unread_count || 0) > 0;

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors group",
                    isActive ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
                  )}
                  onClick={() => onConversationSelect(conversation.id)}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={otherParticipant?.avatar_url} />
                      <AvatarFallback>
                        {`${otherParticipant?.first_name?.charAt(0) || ''}${otherParticipant?.last_name?.charAt(0) || ''}`}
                      </AvatarFallback>
                    </Avatar>
                    {hasUnread && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {conversation.unread_count! > 9 ? '9+' : conversation.unread_count}
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={cn(
                        "font-medium text-sm truncate",
                        hasUnread ? "text-gray-900" : "text-gray-700"
                      )}>
                        {`${otherParticipant?.first_name || ''} ${otherParticipant?.last_name || ''}`.trim() || 'Unknown User'}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(conversation.id, !hasUnread);
                              }}
                            >
                              {hasUnread ? (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Mark as Read
                                </>
                              ) : (
                                <>
                                  <MarkAsUnread className="w-4 h-4 mr-2" />
                                  Mark as Unread
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <p className={cn(
                      "text-sm truncate",
                      hasUnread ? "text-gray-900 font-medium" : "text-gray-500"
                    )}>
                      {conversation.last_message?.content || 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
