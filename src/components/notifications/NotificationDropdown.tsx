
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Search, CheckCircle, Clock, AlertTriangle, Info, X, MessageSquare, FileText, Users, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import type { Notification } from '@/hooks/useNotifications';

interface NotificationDropdownProps {
  onClose: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'system':
    case 'general':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'registration':
      return <UserCheck className="h-4 w-4 text-green-500" />;
    case 'message':
    case 'feedback':
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    case 'finance':
    case 'approval':
      return <FileText className="h-4 w-4 text-orange-500" />;
    case 'meeting':
      return <Users className="h-4 w-4 text-blue-500" />;
    case 'project':
    case 'milestone':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'task':
    case 'deadline':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'community':
      return <Users className="h-4 w-4 text-green-500" />;
    case 'job':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'service':
      return <Users className="h-4 w-4 text-purple-500" />;
    case 'product':
      return <FileText className="h-4 w-4 text-orange-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'normal':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'low':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-blue-600 bg-blue-50 border-blue-200';
  }
};

const NotificationItem = ({ notification, onMarkAsRead }: { notification: Notification; onMarkAsRead: (id: string) => void }) => {
  const isUnread = notification.status === 'unread';
  
  return (
    <div className={cn(
      "p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer",
      isUnread && "bg-blue-50/50"
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getCategoryIcon(notification.category)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={cn(
                "text-sm font-medium mb-1",
                isUnread ? "text-gray-900" : "text-gray-700"
              )}>
                {notification.title}
              </h4>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {notification.message}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </span>
                {isUnread && (
                  <Badge variant="secondary" className={cn("text-xs px-1.5 py-0.5", getPriorityColor(notification.priority))}>
                    {notification.priority}
                  </Badge>
                )}
              </div>
            </div>
            {isUnread && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-6 w-6 p-0"
              >
                <CheckCircle className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { userRole } = useAuth();
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead
  } = useNotifications();

  // Updated role-based filtering to include new notification types
  const roleBasedNotifications = notifications.filter(notification => {
    // General notifications are visible to everyone
    if (notification.category === 'general' || notification.category === 'system') {
      return true;
    }

    switch (userRole) {
      case 'superadmin':
        // Superadmins can see all notifications
        return true;
      case 'official':
        // Officials can see work-related notifications and new content notifications
        return ['task', 'deadline', 'milestone', 'message', 'finance', 'meeting', 'project', 'feedback', 'community', 'job', 'service', 'product'].includes(notification.category);
      case 'resident':
        // Residents can see personal notifications and new content notifications
        return ['approval', 'message', 'feedback', 'registration', 'community', 'job', 'service', 'product'].includes(notification.category);
      default:
        // Fallback: show general notifications and new content for any unrecognized role
        return ['general', 'system', 'community', 'job', 'service', 'product'].includes(notification.category);
    }
  });

  const filteredNotifications = roleBasedNotifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadNotifications = filteredNotifications.filter(n => n.status === 'unread');
  const urgentNotifications = filteredNotifications.filter(n => n.priority === 'urgent');
  const normalNotifications = filteredNotifications.filter(n => n.priority === 'normal');

  // Group notifications by date for "All" tab
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayNotifications = filteredNotifications.filter(n => {
    const notifDate = new Date(n.created_at);
    return notifDate.toDateString() === today.toDateString();
  });

  const yesterdayNotifications = filteredNotifications.filter(n => {
    const notifDate = new Date(n.created_at);
    return notifDate.toDateString() === yesterday.toDateString();
  });

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-8 text-sm border-blue-200 focus:border-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead()}
              disabled={isMarkingAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 px-2"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full h-10 p-1 bg-gray-50 rounded-none border-b">
          <TabsTrigger value="all" className="flex-1 text-xs h-8 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
            All ({filteredNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex-1 text-xs h-8 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
            Unread ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="urgent" className="flex-1 text-xs h-8 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
            Urgent ({urgentNotifications.length})
          </TabsTrigger>
        </TabsList>

        <div className="max-h-80">
          <ScrollArea className="h-80">
            <TabsContent value="all" className="m-0">
              {/* Today */}
              {todayNotifications.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 border-b">
                    <span className="text-xs font-medium text-gray-700">Today</span>
                  </div>
                  {todayNotifications.slice(0, 3).map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                    />
                  ))}
                </div>
              )}

              {/* Yesterday */}
              {yesterdayNotifications.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 border-b">
                    <span className="text-xs font-medium text-gray-700">Yesterday</span>
                  </div>
                  {yesterdayNotifications.slice(0, 3).map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                    />
                  ))}
                </div>
              )}

              {filteredNotifications.length === 0 && (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No notifications found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="unread" className="m-0">
              {unreadNotifications.slice(0, 5).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
              {unreadNotifications.length === 0 && (
                <div className="p-8 text-center">
                  <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No unread notifications</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="urgent" className="m-0">
              {urgentNotifications.slice(0, 5).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
              {urgentNotifications.length === 0 && (
                <div className="p-8 text-center">
                  <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No urgent notifications</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </div>

        {/* View All Button - Full Width at Bottom */}
        <div className="p-3 border-t bg-gray-50">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700" variant="default" size="sm">
            <Link to="/notifications" onClick={onClose}>
              View All Notifications
            </Link>
          </Button>
        </div>
      </Tabs>
    </div>
  );
};
