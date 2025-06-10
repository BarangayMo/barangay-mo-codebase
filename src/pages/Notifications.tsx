
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Layout } from "@/components/layout/Layout";
import { useNotifications } from "@/hooks/useNotifications";
import { CheckCircle, Archive, Loader2, Search, Filter, Bell, AlertTriangle, Info, Clock, Calendar, User, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Notification } from '@/hooks/useNotifications';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'system':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'task':
    case 'deadline':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case 'milestone':
    case 'project':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'normal':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'low':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-blue-100 text-blue-700 border-blue-200';
  }
};

const NotificationListItem = ({ 
  notification, 
  isSelected, 
  onClick, 
  onMarkAsRead, 
  onArchive 
}: { 
  notification: Notification; 
  isSelected: boolean; 
  onClick: () => void; 
  onMarkAsRead: (id: string) => void; 
  onArchive: (id: string) => void; 
}) => {
  const isUnread = notification.status === 'unread';
  
  return (
    <div 
      className={cn(
        "p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors",
        isSelected && "bg-blue-50 border-blue-200",
        isUnread && "bg-blue-50/30"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getCategoryIcon(notification.category)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={cn(
                "text-sm font-medium mb-1 line-clamp-1",
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
                <Badge variant="outline" className={cn("text-xs", getPriorityColor(notification.priority))}>
                  {notification.priority}
                </Badge>
                {isUnread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isUnread && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMarkAsRead(notification.id); }}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as read
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(notification.id); }}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationDetail = ({ notification }: { notification: Notification | null }) => {
  if (!notification) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">No notification selected</p>
          <p className="text-sm">Select a notification to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            {getCategoryIcon(notification.category)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {notification.title}
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </div>
              <Badge variant="outline" className={cn("text-xs", getPriorityColor(notification.priority))}>
                {notification.priority} priority
              </Badge>
              <Badge variant="outline" className="text-xs">
                {notification.category}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {notification.message}
          </p>
          
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Additional Details</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(notification.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {notification.action_url && (
        <div className="p-6 border-t border-gray-200">
          <Button asChild className="w-full">
            <a href={notification.action_url} target="_blank" rel="noopener noreferrer">
              View Details
              <MoreHorizontal className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    archiveNotification,
    markAllAsRead,
    isMarkingAllAsRead
  } = useNotifications();

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadNotifications = filteredNotifications.filter(n => n.status === 'unread');
  const urgentNotifications = filteredNotifications.filter(n => n.priority === 'urgent');
  const normalNotifications = filteredNotifications.filter(n => n.priority === 'normal');
  const archivedNotifications = filteredNotifications.filter(n => n.status === 'archived');

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full min-h-screen bg-gray-50">
        <div className="grid grid-cols-12 h-screen">
          {/* Left Sidebar */}
          <div className="col-span-3 bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h1>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAllAsRead()}
                    disabled={isMarkingAllAsRead}
                    className="flex-1"
                  >
                    {isMarkingAllAsRead ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Mark all read
                  </Button>
                )}
                <Button variant="outline" size="sm" className="flex-1">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full h-12 p-1 bg-gray-50 rounded-none border-b">
                <TabsTrigger value="all" className="flex-1">
                  All ({filteredNotifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread ({unreadNotifications.length})
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-200px)]">
                <TabsContent value="all" className="m-0">
                  {filteredNotifications.map((notification) => (
                    <NotificationListItem
                      key={notification.id}
                      notification={notification}
                      isSelected={selectedNotification?.id === notification.id}
                      onClick={() => setSelectedNotification(notification)}
                      onMarkAsRead={markAsRead}
                      onArchive={archiveNotification}
                    />
                  ))}
                  {filteredNotifications.length === 0 && (
                    <div className="p-8 text-center">
                      <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No notifications found</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="unread" className="m-0">
                  {unreadNotifications.map((notification) => (
                    <NotificationListItem
                      key={notification.id}
                      notification={notification}
                      isSelected={selectedNotification?.id === notification.id}
                      onClick={() => setSelectedNotification(notification)}
                      onMarkAsRead={markAsRead}
                      onArchive={archiveNotification}
                    />
                  ))}
                  {unreadNotifications.length === 0 && (
                    <div className="p-8 text-center">
                      <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No unread notifications</p>
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Main Content - Notification List */}
          <div className="col-span-4 bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  {selectedNotification ? 'Recent Notifications' : 'All Notifications'}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{filteredNotifications.length}</Badge>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-120px)]">
              {/* Priority Notifications */}
              {urgentNotifications.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-red-50 border-b border-red-100">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-700">Urgent ({urgentNotifications.length})</span>
                    </div>
                  </div>
                  {urgentNotifications.slice(0, 3).map((notification) => (
                    <NotificationListItem
                      key={notification.id}
                      notification={notification}
                      isSelected={selectedNotification?.id === notification.id}
                      onClick={() => setSelectedNotification(notification)}
                      onMarkAsRead={markAsRead}
                      onArchive={archiveNotification}
                    />
                  ))}
                </div>
              )}

              {/* Normal Notifications */}
              {normalNotifications.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Recent ({normalNotifications.length})</span>
                    </div>
                  </div>
                  {normalNotifications.slice(0, 10).map((notification) => (
                    <NotificationListItem
                      key={notification.id}
                      notification={notification}
                      isSelected={selectedNotification?.id === notification.id}
                      onClick={() => setSelectedNotification(notification)}
                      onMarkAsRead={markAsRead}
                      onArchive={archiveNotification}
                    />
                  ))}
                </div>
              )}

              {filteredNotifications.length === 0 && (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-500">You're all caught up! Check back later for new updates.</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Right Panel - Notification Detail */}
          <div className="col-span-5 bg-white">
            <NotificationDetail notification={selectedNotification} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
