
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessageSquare, Filter, MoreVertical, Mail, MailOpen } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';

export function ConversationsList() {
  const navigate = useNavigate();
  const {
    conversations,
    loading,
    filter,
    setFilter,
    fetchConversations,
    markConversationAsRead
  } = useMessages();

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleConversationClick = (conversationId: string) => {
    navigate(`/messages/${conversationId}`);
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with filters */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Messages</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                {filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : 'Read'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All Conversations
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('unread')}>
                Unread Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('read')}>
                Read Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Conversations list */}
      <ScrollArea className="flex-1">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {filter === 'unread' ? 'No unread messages' : 
                 filter === 'read' ? 'No read messages' : 
                 'No conversations yet'}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-4 hover:bg-gray-50 cursor-pointer flex items-center space-x-3"
                onClick={() => handleConversationClick(conversation.id)}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage 
                    src={conversation.other_participant?.avatar_url || ''} 
                    alt={`${conversation.other_participant?.first_name} ${conversation.other_participant?.last_name}`}
                  />
                  <AvatarFallback>
                    {conversation.other_participant?.first_name?.charAt(0)}
                    {conversation.other_participant?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conversation.other_participant?.first_name} {conversation.other_participant?.last_name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {conversation.unread_count && conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unread_count}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {conversation.last_message_at && 
                          formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-sm truncate ${
                      conversation.unread_count && conversation.unread_count > 0 
                        ? 'font-medium text-gray-900' 
                        : 'text-gray-600'
                    }`}>
                      {conversation.last_message?.content || 'No messages yet'}
                    </p>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            markConversationAsRead(conversation.id, true);
                          }}
                        >
                          <MailOpen className="w-4 h-4 mr-2" />
                          Mark as Read
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            markConversationAsRead(conversation.id, false);
                          }}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Mark as Unread
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
