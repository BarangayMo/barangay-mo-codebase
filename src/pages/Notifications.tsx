"use client"

import { useState } from "react"
import { useNotifications } from "@/hooks/useNotifications"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { Bell, Clock, AlertTriangle, Briefcase, Settings, CheckCircle } from "lucide-react"
import type { Notification } from "@/hooks/useNotifications"

const Notifications = () => {
  const { userRole } = useAuth()
  const {
    notifications,
    isLoading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isMarkingAsRead,
    isMarkingAllAsRead,
  } = useNotifications()
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Updated role-based filtering with the actual categories from your database
  const filterNotificationsByRole = (notificationList: Notification[]) => {
    console.log("Filtering notifications by role:", userRole, "Total notifications:", notificationList.length)

    return notificationList.filter((notification) => {
      // Log each notification being processed
      console.log("Processing notification:", notification.id, "Category:", notification.category)

      // General and system notifications are visible to everyone
      if (notification.category === "general" || notification.category === "system") {
        console.log("Showing general/system notification:", notification.id)
        return true
      }

      switch (userRole) {
        case "superadmin":
          // Superadmins can see all notifications
          return true
        case "official":
          // Officials can see work-related notifications including jobs and services
          return [
            "task",
            "deadline",
            "milestone",
            "message",
            "finance",
            "meeting",
            "project",
            "feedback",
            "jobs", // Your actual category
            "services", // Your actual category
            "job",
            "service",
            "product",
            "community",
            "job_posting",
            "product_listing",
            "community_post",
            "work",
            "announcement",
          ].includes(notification.category)
        case "resident":
          // Residents can see personal notifications including jobs and services
          return [
            "approval",
            "message",
            "feedback",
            "registration",
            "jobs", // Your actual category
            "services", // Your actual category
            "job",
            "service",
            "product",
            "community",
            "job_posting",
            "product_listing",
            "community_post",
            "personal",
            "announcement",
            "alert",
            "reminder",
          ].includes(notification.category)
        default:
          // More permissive fallback - include jobs and services for any role
          return ["general", "system", "jobs", "services", "job", "service", "announcement", "alert"].includes(
            notification.category,
          )
      }
    })
  }

  const filterNotificationsBySearch = (notificationList: Notification[]) => {
    if (!searchTerm) {
      return notificationList
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return notificationList.filter(
      (notification) =>
        notification.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        notification.message.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }

  const currentNotifications = activeTab === "all" ? notifications : notifications.filter((n) => n.status === "unread")
  const roleBasedNotifications = filterNotificationsByRole(currentNotifications)
  const filteredNotifications = filterNotificationsBySearch(roleBasedNotifications)
  const unreadNotifications = notifications.filter((n) => n.status === "unread")
  const urgentNotifications = notifications.filter((n) => n.priority === "urgent")

  // Define role-based color schemes
  const roleColors = {
    superadmin: { stats: "bg-purple-50 text-purple-700" },
    official: { stats: "bg-blue-50 text-blue-700" },
    resident: { stats: "bg-green-50 text-green-700" },
  }

  // Determine the color scheme based on the user role
  const userRoleForColors = userRole in roleColors ? userRole : "resident"

  // Enhanced debug logging
  console.log("Notifications page filtering - DETAILED:", {
    activeTab,
    userRole,
    totalNotifications: currentNotifications.length,
    afterRoleFilter: roleBasedNotifications.length,
    afterSearchFilter: filteredNotifications.length,
    unreadCount: unreadNotifications.length,
    allCategories: [...new Set(currentNotifications.map((n) => n.category))],
    filteredCategories: [...new Set(roleBasedNotifications.map((n) => n.category))],
    sampleNotifications: currentNotifications.slice(0, 3).map((n) => ({
      id: n.id,
      title: n.title,
      category: n.category,
      status: n.status,
    })),
  })

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleMarkAsRead = (notificationId: string) => {
    console.log("Attempting to mark as read:", notificationId)
    markAsRead(notificationId)
  }

  const handleMarkAllAsRead = () => {
    console.log("Attempting to mark all as read")
    markAllAsRead()
  }

  // Main content component
  const NotificationsContent = () => (
    <div className="w-full">
      {/* Debug Info - Remove this in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <strong>Debug Info:</strong> Total: {notifications.length}, Role-filtered: {roleBasedNotifications.length},
          Search-filtered: {filteredNotifications.length}, Unread: {unreadNotifications.length}, Categories:{" "}
          {[...new Set(notifications.map((n) => n.category))].join(", ")}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Mark All as Read Button */}
      {unreadNotifications.length > 0 && (
        <div className="mb-4">
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMarkingAllAsRead ? "Marking all as read..." : `Mark all ${unreadNotifications.length} as read`}
          </button>
        </div>
      )}

      {/* Compact Stats for Mobile with Role Colors - Fixed overflow */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 px-1">
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap flex-shrink-0 min-w-0",
              roleColors[userRoleForColors as keyof typeof roleColors]?.stats,
            )}
          >
            <Bell className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium">{filteredNotifications.length}</span>
            <span className="text-xs hidden sm:inline">Total</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-full whitespace-nowrap flex-shrink-0 min-w-0">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium">{unreadNotifications.length}</span>
            <span className="text-xs hidden sm:inline">Unread</span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-full whitespace-nowrap flex-shrink-0 min-w-0">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium">{urgentNotifications.length}</span>
            <span className="text-xs hidden sm:inline">Urgent</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-full whitespace-nowrap flex-shrink-0 min-w-0">
            <Briefcase className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium">{notifications.filter((n) => n.category === "jobs").length}</span>
            <span className="text-xs hidden sm:inline">Jobs</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full whitespace-nowrap flex-shrink-0 min-w-0">
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium">{notifications.filter((n) => n.category === "services").length}</span>
            <span className="text-xs hidden sm:inline">Services</span>
          </div>
        </div>
      </div>

      {isLoading && <div className="text-center">Loading notifications...</div>}
      {error && <div className="text-red-500 text-center">Error: {error.message}</div>}
      {!isLoading && !error && filteredNotifications.length === 0 && (
        <div className="text-center">No notifications found.</div>
      )}
      {!isLoading &&
        !error &&
        filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "border-b pb-3 mb-3 last:border-b-0 p-3 rounded-lg",
              notification.status === "unread" ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4
                  className={cn(
                    "text-sm font-medium mb-1",
                    notification.status === "unread" ? "text-gray-900" : "text-gray-700",
                  )}
                >
                  {notification.title}
                </h4>
                <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{notification.category}</span>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded",
                      notification.status === "unread" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700",
                    )}
                  >
                    {notification.status}
                  </span>
                  {notification.priority && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      {notification.priority}
                    </span>
                  )}
                </div>
              </div>
              {notification.status === "unread" && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  disabled={isMarkingAsRead}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-3 w-3" />
                  {isMarkingAsRead ? "..." : "Mark Read"}
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>

      {/* Tab Navigation */}
      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded-l-md ${activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => handleTabChange("all")}
        >
          All Notifications
        </button>
        <button
          className={`px-4 py-2 rounded-r-md ${activeTab === "unread" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => handleTabChange("unread")}
        >
          Unread ({unreadNotifications.length})
        </button>
      </div>

      {/* Notifications Content */}
      <NotificationsContent />
    </div>
  )
}

export default Notifications
