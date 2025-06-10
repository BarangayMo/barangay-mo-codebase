
import { Layout } from "@/components/layout/Layout";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { useNotifications } from "@/hooks/useNotifications";
import { CheckCircle, Archive, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Notifications() {
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    archiveNotification,
    markAllAsRead,
    isMarkingAllAsRead
  } = useNotifications();

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  const unreadNotifications = notifications.filter(n => n.status === 'unread');
  const readNotifications = notifications.filter(n => n.status === 'read');

  return (
    <Layout>
      <div className="w-full pb-36 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="secondary">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsRead()}
                  disabled={isMarkingAllAsRead}
                  className="gap-2"
                >
                  {isMarkingAllAsRead ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6 space-y-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! Check back later for new updates.</p>
            </div>
          ) : (
            <>
              {/* Unread Notifications */}
              {unreadNotifications.length > 0 && (
                <div>
                  <h2 className="font-semibold text-lg mb-3 text-gray-900">
                    New ({unreadNotifications.length})
                  </h2>
                  <div className="space-y-3">
                    {unreadNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onArchive={archiveNotification}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Read Notifications */}
              {readNotifications.length > 0 && (
                <div>
                  <h2 className="font-semibold text-lg mb-3 text-gray-900">
                    Earlier ({readNotifications.length})
                  </h2>
                  <div className="space-y-3">
                    {readNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onArchive={archiveNotification}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
