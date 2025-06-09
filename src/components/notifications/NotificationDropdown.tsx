
import { useState } from "react";
import { Bell, Clock, AlertCircle, CheckCircle, Archive, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRecentNotifications, useMarkNotificationAsRead } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const categoryIcons = {
  project: "🚀",
  task: "📋",
  finance: "💰",
  meeting: "📅",
  feedback: "💬",
  general: "📢",
};

const priorityColors = {
  urgent: "text-red-600",
  normal: "text-blue-600",
  low: "text-gray-600",
};

export const NotificationDropdown = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { data: notifications = [], isLoading } = useRecentNotifications(15);
  const markAsReadMutation = useMarkNotificationAsRead();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const filters = ["All", "Urgent", "Normal", "Resolved"];

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Urgent") return notification.priority === "urgent";
    if (selectedFilter === "Normal") return notification.priority === "normal";
    if (selectedFilter === "Resolved") return notification.status === "read";
    return true;
  });

  const handleNotificationClick = (notification: any) => {
    if (notification.status === 'unread') {
      markAsReadMutation.mutate(notification.id);
    }
  };

  const getTimeGroup = (createdAt: string) => {
    const now = new Date();
    const notificationDate = new Date(createdAt);
    const diffInHours = (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) return "Today";
    if (diffInHours < 48) return "Yesterday";
    return "Earlier";
  };

  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const group = getTimeGroup(notification.created_at);
    if (!groups[group]) groups[group] = [];
    groups[group].push(notification);
    return groups;
  }, {} as Record<string, any[]>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <Badge variant="secondary">{unreadCount} new</Badge>
          </div>
          
          <div className="flex gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className={`text-xs ${
                  selectedFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="h-96">
          <div className="p-2">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : (
              Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
                <div key={group} className="mb-4">
                  <div className="text-xs font-semibold text-gray-500 px-2 py-1 mb-2">
                    {group}
                  </div>
                  {groupNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                        notification.status === 'unread'
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg flex-shrink-0">
                          {categoryIcons[notification.category as keyof typeof categoryIcons] || "📢"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium truncate">
                              {notification.title}
                            </h4>
                            {notification.status === 'unread' && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </span>
                            <div className="flex gap-1">
                              {notification.priority === 'urgent' && (
                                <AlertCircle className="w-3 h-3 text-red-500" />
                              )}
                              <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t bg-gray-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/notifications')}
            className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            View all notifications
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
