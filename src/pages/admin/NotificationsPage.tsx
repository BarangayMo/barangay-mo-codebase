
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  Archive, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  Tag,
  Calendar,
  User
} from "lucide-react";
import { useNotifications, useMarkNotificationAsRead, useArchiveNotification } from "@/hooks/use-notifications";
import { formatDistanceToNow, format } from "date-fns";

const categoryIcons = {
  project: "🚀",
  task: "📋", 
  finance: "💰",
  meeting: "📅",
  feedback: "💬",
  general: "📢",
};

const categoryColors = {
  project: "bg-purple-100 text-purple-800",
  task: "bg-blue-100 text-blue-800", 
  finance: "bg-green-100 text-green-800",
  meeting: "bg-orange-100 text-orange-800",
  feedback: "bg-pink-100 text-pink-800",
  general: "bg-gray-100 text-gray-800",
};

export default function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] = useState("View All");
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const archiveNotification = useArchiveNotification();

  const filters = ["View All", "Projects", "Tasks", "Finance", "Meetings", "Feedback"];

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === "View All") return notification.status !== 'archived';
    return notification.category === selectedFilter.toLowerCase().slice(0, -1) && notification.status !== 'archived';
  });

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
    if (notification.status === 'unread') {
      markAsReadMutation.mutate(notification.id);
    }
  };

  const handleMarkAsRead = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(notificationId);
  };

  const handleArchive = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    archiveNotification.mutate(notificationId);
    if (selectedNotification?.id === notificationId) {
      setSelectedNotification(null);
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <AdminLayout title="Notifications" hidePageHeader>
      <div className="h-[calc(100vh-2rem)] bg-gray-50 flex flex-col -mx-6 -my-2">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-gray-600" />
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={`${
                    selectedFilter === filter
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Notifications List */}
          <div className="w-1/2 border-r bg-white">
            <ScrollArea className="h-full">
              <div className="p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">Loading notifications...</div>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">No notifications found</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <Card
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedNotification?.id === notification.id
                            ? "ring-2 ring-blue-500 bg-blue-50"
                            : notification.status === 'unread'
                            ? "bg-blue-50/50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="text-lg flex-shrink-0">
                              {categoryIcons[notification.category as keyof typeof categoryIcons] || "📢"}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-sm truncate">
                                  {notification.title}
                                </h3>
                                {notification.status === 'unread' && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                )}
                                {notification.priority === 'urgent' && (
                                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                )}
                              </div>
                              
                              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge className={categoryColors[notification.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"}>
                                    {notification.category}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                  </span>
                                </div>
                                
                                <div className="flex gap-1">
                                  {notification.status === 'unread' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <CheckCircle className="w-3 h-3" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleArchive(notification.id, e)}
                                    className="h-6 w-6 p-0"
                                    >
                                    <Archive className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Notification Details */}
          <div className="w-1/2 bg-white">
            {selectedNotification ? (
              <div className="h-full flex flex-col">
                <div className="p-6 border-b">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-2xl">
                      {categoryIcons[selectedNotification.category as keyof typeof categoryIcons] || "📢"}
                    </div>
                    <div className="flex-1">
                      <h1 className="text-xl font-bold mb-2">{selectedNotification.title}</h1>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(selectedNotification.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                        <Badge className={categoryColors[selectedNotification.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"}>
                          <Tag className="w-3 h-3 mr-1" />
                          {selectedNotification.category}
                        </Badge>
                        {selectedNotification.priority === 'urgent' && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Summary</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedNotification.message}
                      </p>
                    </div>

                    {selectedNotification.metadata && Object.keys(selectedNotification.metadata).length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Details</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          {Object.entries(selectedNotification.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600 capitalize">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="text-sm text-gray-800">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold mb-2">Next Steps</h3>
                      <div className="space-y-2">
                        {selectedNotification.category === 'task' && (
                          <p className="text-sm text-gray-700">• Review the task details and accept or decline the assignment</p>
                        )}
                        {selectedNotification.category === 'project' && (
                          <p className="text-sm text-gray-700">• Check project dashboard for detailed progress</p>
                        )}
                        {selectedNotification.category === 'finance' && (
                          <p className="text-sm text-gray-700">• Review budget details and provide approval</p>
                        )}
                        {selectedNotification.category === 'meeting' && (
                          <p className="text-sm text-gray-700">• Add meeting to your calendar and prepare agenda</p>
                        )}
                        {selectedNotification.category === 'feedback' && (
                          <p className="text-sm text-gray-700">• Review feedback and respond accordingly</p>
                        )}
                        <p className="text-sm text-gray-700">• Mark as read when action is complete</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      {selectedNotification.status === 'unread' && (
                        <Button
                          onClick={() => markAsReadMutation.mutate(selectedNotification.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => archiveNotification.mutate(selectedNotification.id)}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Related Item
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a notification to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
