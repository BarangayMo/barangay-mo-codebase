
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Archive, Loader2, Search, Filter, Bell, AlertTriangle, Info, Clock, Calendar, User, Eye, MoreHorizontal, UserCheck, FileText, MessageSquare, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { Notification } from '@/hooks/useNotifications';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'system':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'registration':
      return <UserCheck className="h-5 w-5 text-green-500" />;
    case 'message':
      return <MessageSquare className="h-5 w-5 text-purple-500" />;
    case 'approval':
      return <FileText className="h-5 w-5 text-orange-500" />;
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

const getActionButtons = (notification: Notification) => {
  const buttons = [];

  switch (notification.category) {
    case 'registration':
      buttons.push(
        <Button key="approve" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
          <UserCheck className="h-3 w-3 mr-1" />
          Approve
        </Button>,
        <Button key="reject" variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
          Reject
        </Button>
      );
      break;
    case 'message':
      buttons.push(
        <Button key="reply" size="sm" variant="outline">
          <MessageSquare className="h-3 w-3 mr-1" />
          Reply
        </Button>,
        <Button key="view" size="sm" asChild>
          <Link to="/admin/messages">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Link>
        </Button>
      );
      break;
    case 'approval':
      buttons.push(
        <Button key="review" size="sm">
          <FileText className="h-3 w-3 mr-1" />
          Review
        </Button>,
        <Button key="approve" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
          Approve
        </Button>
      );
      break;
    default:
      buttons.push(
        <Button key="view" size="sm" variant="outline">
          <Eye className="h-3 w-3 mr-1" />
          View Details
        </Button>
      );
  }

  return buttons;
};

const NotificationListItem = ({ 
  notification, 
  onMarkAsRead, 
  onArchive,
  isSelected,
  onSelect
}: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void; 
  onArchive: (id: string) => void; 
  isSelected: boolean;
  onSelect: (notification: Notification) => void;
}) => {
  const isUnread = notification.status === 'unread';
  
  return (
    <div 
      className={cn(
        "p-4 border-b cursor-pointer transition-colors hover:bg-gray-50",
        isUnread && "bg-blue-50/50",
        isSelected && "bg-blue-100 border-l-4 border-l-blue-500"
      )}
      onClick={() => onSelect(notification)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getCategoryIcon(notification.category)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={cn(
              "text-sm font-semibold",
              isUnread ? "text-gray-900" : "text-gray-700"
            )}>
              {notification.title}
            </h4>
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
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </span>
            <Badge variant="outline" className={cn("text-xs", getPriorityColor(notification.priority))}>
              {notification.priority}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {notification.category}
            </Badge>
            {isUnread && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationDetails = ({ 
  notification, 
  onMarkAsRead, 
  onArchive,
  onClose 
}: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void; 
  onArchive: (id: string) => void;
  onClose: () => void;
}) => {
  const isUnread = notification.status === 'unread';
  const actionButtons = getActionButtons(notification);
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Notification Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
              {getCategoryIcon(notification.category)}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {notification.title}
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className={cn("text-sm", getPriorityColor(notification.priority))}>
                  {notification.priority}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {notification.category}
                </Badge>
                {isUnread && (
                  <Badge className="bg-blue-500 text-white text-sm">
                    Unread
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Message</h5>
            <p className="text-gray-600 leading-relaxed">
              {notification.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Created:</span>
              <p className="text-gray-600">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
            </div>
            {notification.read_at && (
              <div>
                <span className="font-medium text-gray-700">Read:</span>
                <p className="text-gray-600">
                  {formatDistanceToNow(new Date(notification.read_at), { addSuffix: true })}
                </p>
              </div>
            )}
          </div>

          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Additional Details</h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(notification.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t bg-gray-50 space-y-3">
        {/* Action Buttons */}
        {actionButtons.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {actionButtons}
          </div>
        )}
        
        {/* Standard Actions */}
        <div className="flex items-center gap-2">
          {isUnread && (
            <Button onClick={() => onMarkAsRead(notification.id)} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Read
            </Button>
          )}
          <Button variant="outline" onClick={() => onArchive(notification.id)} className="flex-1">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const { userRole } = useAuth();
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    archiveNotification,
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

  const handleNotificationSelect = (notification: Notification) => {
    setSelectedNotification(notification);
    if (notification.status === 'unread') {
      markAsRead(notification.id);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Notifications">
        <div className="w-full min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Notifications">
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Notifications
            {userRole === 'superadmin' && ' - Admin Dashboard'}
            {userRole === 'official' && ' - Official Dashboard'}
            {userRole === 'resident' && ' - Resident Dashboard'}
          </h1>
          <p className="text-gray-600">
            Manage your {userRole === 'superadmin' ? 'administrative' : userRole === 'official' ? 'barangay' : 'personal'} notifications and stay updated
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredNotifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadNotifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-gray-900">{urgentNotifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-20rem)]">
          {/* Notifications List */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>All Notifications</CardTitle>
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAllAsRead()}
                      disabled={isMarkingAllAsRead}
                    >
                      {isMarkingAllAsRead ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Mark all read
                    </Button>
                  )}
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>

              <ScrollArea className="h-[calc(100%-140px)]">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <NotificationListItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onArchive={archiveNotification}
                      isSelected={selectedNotification?.id === notification.id}
                      onSelect={handleNotificationSelect}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-500">You're all caught up! Check back later for new updates.</p>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>

          {/* Notification Details */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              {selectedNotification ? (
                <NotificationDetails
                  notification={selectedNotification}
                  onMarkAsRead={markAsRead}
                  onArchive={archiveNotification}
                  onClose={() => setSelectedNotification(null)}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">Select a notification</h3>
                    <p className="text-gray-400">Choose a notification from the list to view its details</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
