
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Search, CheckCircle, Clock, AlertTriangle, Info, X } from 'lucide-react';
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
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'registration':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'task':
    case 'deadline':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'milestone':
    case 'project':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
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
                className="text-blue-600 hover:text-blue-700 h-6 w-6 p-0"
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

  // Filter notifications based on user role
  const roleBasedNotifications = notifications.filter(notification => {
    switch (userRole) {
      case 'superadmin':
        return ['registration', 'message', 'approval', 'system'].includes(notification.category);
      case 'official':
        return ['task', 'deadline', 'milestone', 'message'].includes(notification.category);
      case 'resident':
        return ['approval', 'message', 'system'].includes(notification.category);
      default:
        return true;
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
            className="pl-9 h-8 text-sm"
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
              className="text-xs text-blue-600 hover:text-blue-700 h-7 px-2"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full h-10 p-1 bg-gray-50 rounded-none border-b">
          <TabsTrigger value="all" className="flex-1 text-xs h-8">
            All ({filteredNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="urgent" className="flex-1 text-xs h-8">
            Urgent ({urgentNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="normal" className="flex-1 text-xs h-8">
            Normal ({normalNotifications.length})
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

            <TabsContent value="normal" className="m-0">
              {normalNotifications.slice(0, 5).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
              {normalNotifications.length === 0 && (
                <div className="p-8 text-center">
                  <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No normal notifications</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </div>

        {/* View All Button - Full Width at Bottom */}
        <div className="p-3 border-t bg-gray-50">
          <Button asChild className="w-full" variant="default" size="sm">
            <Link to="/notifications" onClick={onClose}>
              View All Notifications
            </Link>
          </Button>
        </div>
      </Tabs>
    </div>
  );
};
