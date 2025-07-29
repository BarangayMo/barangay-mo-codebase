import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Layout } from "@/components/layout/Layout";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Archive, Loader2, Search, Filter, Bell, AlertTriangle, Info, Clock, Calendar, User, Eye, MoreHorizontal, UserCheck, FileText, MessageSquare, Users, X, ArchiveRestore } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import type { Notification } from '@/hooks/useNotifications';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'system':
    case 'general':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'registration':
      return <UserCheck className="h-5 w-5 text-green-500" />;
    case 'message':
      return <MessageSquare className="h-5 w-5 text-purple-500" />;
    case 'approval':
      return <FileText className="h-5 w-5 text-orange-500" />;
    case 'finance':
      return <FileText className="h-5 w-5 text-green-500" />;
    case 'meeting':
      return <Users className="h-5 w-5 text-blue-500" />;
    case 'feedback':
      return <MessageSquare className="h-5 w-5 text-purple-500" />;
    case 'project':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'task':
    case 'deadline':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case 'milestone':
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

const getRoleColors = (userRole: string) => {
  switch (userRole) {
    case 'superadmin':
      return {
        primary: 'bg-purple-600 hover:bg-purple-700 border-purple-200 text-purple-600 hover:bg-purple-50',
        secondary: 'border-purple-200 text-purple-600 hover:bg-purple-50',
        stats: 'bg-purple-50 text-purple-700'
      };
    case 'official':
      return {
        primary: 'bg-blue-600 hover:bg-blue-700 border-blue-200 text-blue-600 hover:bg-blue-50',
        secondary: 'border-blue-200 text-blue-600 hover:bg-blue-50',
        stats: 'bg-blue-50 text-blue-700'
      };
    case 'resident':
      return {
        primary: 'bg-green-600 hover:bg-green-700 border-green-200 text-green-600 hover:bg-green-50',
        secondary: 'border-green-200 text-green-600 hover:bg-green-50',
        stats: 'bg-green-50 text-green-700'
      };
    default:
      return {
        primary: 'bg-blue-600 hover:bg-blue-700 border-blue-200 text-blue-600 hover:bg-blue-50',
        secondary: 'border-blue-200 text-blue-600 hover:bg-blue-50',
        stats: 'bg-blue-50 text-blue-700'
      };
  }
};

const getActionButtons = (notification: Notification, userRole: string) => {
  const buttons = [];
  const roleColors = getRoleColors(userRole);

  switch (notification.category) {
    case 'registration':
      buttons.push(
        <Button key="approve" size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1">
          <UserCheck className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Approve</span>
        </Button>,
        <Button key="reject" variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 text-xs px-2 py-1">
          <span className="hidden sm:inline">Reject</span>
          <X className="h-3 w-3 sm:hidden" />
        </Button>
      );
      break;
    case 'message':
    case 'feedback':
      buttons.push(
        <Button key="reply" size="sm" variant="outline" className={`${roleColors.secondary} text-xs px-2 py-1`}>
          <MessageSquare className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Reply</span>
        </Button>,
        <Button key="view" size="sm" asChild className={`${roleColors.primary} text-xs px-2 py-1`}>
          <Link to="/admin/messages">
            <Eye className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">View</span>
          </Link>
        </Button>
      );
      break;
    case 'approval':
    case 'finance':
      buttons.push(
        <Button key="review" size="sm" className={`${roleColors.primary} text-xs px-2 py-1`}>
          <FileText className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Review</span>
        </Button>,
        <Button key="approve" size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1">
          <span className="hidden sm:inline">Approve</span>
          <CheckCircle className="h-3 w-3 sm:hidden" />
        </Button>
      );
      break;
    case 'meeting':
      buttons.push(
        <Button key="join" size="sm" className={`${roleColors.primary} text-xs px-2 py-1`}>
          <Users className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Join Meeting</span>
        </Button>
      );
      break;
    default:
      buttons.push(
        <Button key="view" size="sm" variant="outline" className={`${roleColors.secondary} text-xs px-2 py-1`}>
          <Eye className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">View Details</span>
        </Button>
      );
  }

  return buttons;
};

const NotificationListItem = ({ 
  notification, 
  onMarkAsRead, 
  onArchive,
  onUnarchive,
  isSelected,
  onSelect,
  isArchived = false,
  userRole
}: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void; 
  onArchive: (id: string) => void; 
  onUnarchive: (id: string) => void;
  isSelected: boolean;
  onSelect: (notification: Notification) => void;
  isArchived?: boolean;
  userRole: string;
}) => {
  const isUnread = notification.status === 'unread';
  const roleColors = getRoleColors(userRole);
  
  return (
    <div 
      className={cn(
        "p-3 sm:p-4 border-b cursor-pointer transition-colors hover:bg-gray-50",
        isUnread && "bg-blue-50/50",
        isSelected && `bg-${userRole === 'official' ? 'blue' : userRole === 'resident' ? 'green' : 'purple'}-100 border-l-4 border-l-${userRole === 'official' ? 'blue' : userRole === 'resident' ? 'green' : 'purple'}-500`
      )}
      onClick={() => onSelect(notification)}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="flex-shrink-0 mt-1">
          {getCategoryIcon(notification.category)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={cn(
              "text-sm font-semibold leading-tight",
              isUnread ? "text-gray-900" : "text-gray-700"
            )}>
              {notification.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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
                {isArchived ? (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onUnarchive(notification.id); }}>
                    <ArchiveRestore className="mr-2 h-4 w-4" />
                    Unarchive
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(notification.id); }}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
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
              <div className={`w-2 h-2 rounded-full ${userRole === 'official' ? 'bg-blue-500' : userRole === 'resident' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
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
  onUnarchive,
  onClose,
  isArchived = false,
  userRole
}: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void; 
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onClose: () => void;
  isArchived?: boolean;
  userRole: string;
}) => {
  const isUnread = notification.status === 'unread';
  const actionButtons = getActionButtons(notification, userRole);
  const roleColors = getRoleColors(userRole);
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
        <h3 className="text-lg font-semibold text-gray-900">Notification Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
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
                  <Badge className={`${roleColors.primary.split(' ')[0]} text-white text-sm`}>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
      </ScrollArea>

      <div className="p-4 border-t bg-white sticky bottom-0 space-y-3 z-10">
        {/* Action Buttons */}
        {actionButtons.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {actionButtons}
          </div>
        )}
        
        {/* Standard Actions */}
        <div className="flex items-center gap-2">
          {isUnread && (
            <Button onClick={() => onMarkAsRead(notification.id)} className={`flex-1 ${roleColors.primary.split('hover:')[0]}`}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Read
            </Button>
          )}
          {isArchived ? (
            <Button variant="outline" onClick={() => onUnarchive(notification.id)} className={`flex-1 ${roleColors.secondary}`}>
              <ArchiveRestore className="h-4 w-4 mr-2" />
              Unarchive
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onArchive(notification.id)} className={`flex-1 ${roleColors.secondary}`}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'unread'>('active');
  const { userRole } = useAuth();
  const isMobile = useIsMobile();
  const {
    notifications,
    archivedNotifications,
    isLoading,
    unreadCount,
    markAsRead,
    archiveNotification,
    unarchiveNotification,
    markAllAsRead,
    isMarkingAllAsRead
  } = useNotifications();

  const roleColors = getRoleColors(userRole || 'resident');

  // Updated role-based filtering to include actual database categories
  const filterNotificationsByRole = (notificationList: Notification[]) => {
    return notificationList.filter(notification => {
      // General and system notifications are visible to everyone
      if (notification.category === 'general' || notification.category === 'system') {
        return true;
      }

      switch (userRole) {
        case 'superadmin':
          // Superadmins can see all notifications
          return true;
        case 'official':
          // Officials can see work-related notifications
          return ['task', 'deadline', 'milestone', 'message', 'finance', 'meeting', 'project', 'feedback'].includes(notification.category);
        case 'resident':
          // Residents can see personal and approval notifications
          return ['approval', 'message', 'feedback', 'registration'].includes(notification.category);
        default:
          // Fallback: show general notifications for any unrecognized role
          return ['general', 'system'].includes(notification.category);
      }
    });
  };

  const currentNotifications = activeTab === 'active' ? notifications : 
                              activeTab === 'archived' ? archivedNotifications :
                              notifications.filter(n => n.status === 'unread');
  const roleBasedNotifications = filterNotificationsByRole(currentNotifications);

  const filteredNotifications = roleBasedNotifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadNotifications = notifications.filter(n => n.status === 'unread');
  const urgentNotifications = filteredNotifications.filter(n => n.priority === 'urgent');

  const handleNotificationSelect = (notification: Notification) => {
    setSelectedNotification(notification);
    if (notification.status === 'unread') {
      markAsRead(notification.id);
    }
  };

  if (isLoading) {
    const LoadingComponent = userRole === 'superadmin' ? (
      <AdminLayout title="Notifications">
        <div className="w-full min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    ) : (
      <Layout>
        <div className="w-full min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
    
    return LoadingComponent;
  }

  // Main content component
  const NotificationsContent = () => (
    <div className="w-full">
      {/* Enhanced Header with proper mobile background */}
      <div className={cn(
        "mb-6 p-4 -mx-4 sm:mx-0 sm:p-0",
        isMobile && "bg-white border-b border-gray-200"
      )}>
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

      {/* Compact Stats for Mobile with Role Colors */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 px-1">
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap flex-shrink-0",
            roleColors.stats
          )}>
            <Bell className="h-4 w-4" />
            <span className="text-sm font-medium">{filteredNotifications.length}</span>
            <span className="text-xs hidden sm:inline">Total</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-full whitespace-nowrap flex-shrink-0">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{unreadNotifications.length}</span>
            <span className="text-xs hidden sm:inline">Unread</span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-full whitespace-nowrap flex-shrink-0">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">{urgentNotifications.length}</span>
            <span className="text-xs hidden sm:inline">Urgent</span>
          </div>
        </div>
      </div>

      <div className={cn(
        "grid gap-6",
        isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-5",
        isMobile ? "h-auto" : "h-[calc(100vh-20rem)]"
      )}>
        {/* Notifications List */}
        <div className={cn(
          isMobile ? "order-1" : "lg:col-span-2"
        )}>
          <Card className={cn(
            "flex flex-col",
            isMobile ? "h-auto" : "h-full"
          )}>
            <CardHeader className="pb-4 sticky top-0 bg-white z-10 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={activeTab === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('active')}
                    className={activeTab === 'active' ? roleColors.primary.split('hover:')[0] : roleColors.secondary}
                  >
                    Active
                  </Button>
                  <Button
                    variant={activeTab === 'unread' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('unread')}
                    className={activeTab === 'unread' ? roleColors.primary.split('hover:')[0] : roleColors.secondary}
                  >
                    Unread ({unreadNotifications.length})
                  </Button>
                  <Button
                    variant={activeTab === 'archived' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('archived')}
                    className={activeTab === 'archived' ? roleColors.primary.split('hover:')[0] : roleColors.secondary}
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Archived</span>
                  </Button>
                </div>
                {unreadCount > 0 && activeTab === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAllAsRead()}
                    disabled={isMarkingAllAsRead}
                    className={roleColors.secondary}
                  >
                    {isMarkingAllAsRead ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    <span className="hidden sm:inline">Mark all read</span>
                  </Button>
                )}
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-9 ${roleColors.secondary.includes('border-') ? roleColors.secondary.split('hover:')[0] : 'border-blue-200 focus:border-blue-500'}`}
                />
              </div>

              {activeTab === 'archived' && (
                <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
                  Archived notifications will be automatically deleted after 30 days.
                </div>
              )}
            </CardHeader>

            <ScrollArea className={cn(
              "flex-1",
              isMobile && "max-h-96"
            )}>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationListItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onArchive={archiveNotification}
                    onUnarchive={unarchiveNotification}
                    isSelected={selectedNotification?.id === notification.id}
                    onSelect={handleNotificationSelect}
                    isArchived={activeTab === 'archived'}
                    userRole={userRole || 'resident'}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  {activeTab === 'archived' ? (
                    <>
                      <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No archived notifications</h3>
                      <p className="text-gray-500">Archived notifications will appear here.</p>
                    </>
                  ) : activeTab === 'unread' ? (
                    <>
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No unread notifications</h3>
                      <p className="text-gray-500">All caught up! You have no unread notifications.</p>
                    </>
                  ) : (
                    <>
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                      <p className="text-gray-500">You're all caught up! Check back later for new updates.</p>
                    </>
                  )}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Notification Details */}
        {!isMobile && (
          <div className="lg:col-span-3">
            <Card className="h-full">
              {selectedNotification ? (
                <NotificationDetails
                  notification={selectedNotification}
                  onMarkAsRead={markAsRead}
                  onArchive={archiveNotification}
                  onUnarchive={unarchiveNotification}
                  onClose={() => setSelectedNotification(null)}
                  isArchived={activeTab === 'archived'}
                  userRole={userRole || 'resident'}
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
        )}
      </div>

      {/* Mobile notification details modal */}
      {isMobile && selectedNotification && (
        <div className="fixed inset-0 bg-white z-50 overflow-hidden">
          <NotificationDetails
            notification={selectedNotification}
            onMarkAsRead={markAsRead}
            onArchive={archiveNotification}
            onUnarchive={unarchiveNotification}
            onClose={() => setSelectedNotification(null)}
            isArchived={activeTab === 'archived'}
            userRole={userRole || 'resident'}
          />
        </div>
      )}
    </div>
  );

  // Conditionally render with appropriate layout based on user role
  if (userRole === 'superadmin') {
    return (
      <AdminLayout title="Notifications">
        <NotificationsContent />
      </AdminLayout>
    );
  }

  // For officials and residents, use the Layout component (which shows the correct sidebar)
  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-2">
        <NotificationsContent />
      </div>
    </Layout>
  );
}
