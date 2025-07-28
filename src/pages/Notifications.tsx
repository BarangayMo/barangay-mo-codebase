"use client"

import type React from "react"

import { useState } from "react"
import { useNotifications } from "@/hooks/useNotifications"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { Bell, Archive, Trash2, ExternalLink, Mail, MailOpen, MoreVertical } from "lucide-react"
import type { Notification } from "@/hooks/useNotifications"

const Notifications = () => {
  const { userRole } = useAuth()
  const {
    notifications,
    isLoading,
    error,
    unreadCount,
    markAsRead,
    archiveNotification,
    isMarkingAsRead,
    isArchiving,
  } = useNotifications()
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [showActions, setShowActions] = useState<string | null>(null)

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

  const handleMarkAsRead = (notificationId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation() // Prevent notification click when clicking mark as read
    }
    console.log("Attempting to mark as read:", notificationId)
    markAsRead(notificationId)
  }

  const handleArchive = (notificationId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    console.log("Attempting to archive:", notificationId)
    archiveNotification(notificationId)
    setShowActions(null)
  }

  const handleDelete = async (notificationId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }

    if (confirm("Are you sure you want to delete this notification? This action cannot be undone.")) {
      try {
        // You'll need to add a delete mutation to your hook
        console.log("Attempting to delete:", notificationId)
        // For now, we'll archive it as delete functionality
        archiveNotification(notificationId)
        setShowActions(null)
      } catch (error) {
        console.error("Failed to delete notification:", error)
      }
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    console.log("Notification clicked:", notification.id)

    // Mark as read if it's unread
    if (notification.status === "unread") {
      markAsRead(notification.id)
    }

    // Navigate to the action URL if it exists
    if (notification.action_url) {
      window.open(notification.action_url, "_blank")
    } else {
      // Generate default URLs based on category
      let defaultUrl = ""
      switch (notification.category) {
        case "jobs":
          defaultUrl = "/jobs"
          break
        case "services":
          defaultUrl = "/services"
          break
        case "community":
          defaultUrl = "/community"
          break
        case "product":
          defaultUrl = "/products"
          break
        default:
          defaultUrl = "/dashboard"
      }

      // Use window.location for internal navigation
      window.location.href = defaultUrl
    }
  }

  const toggleActions = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setShowActions(showActions === notificationId ? null : notificationId)
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

      {/* Filter Buttons */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => handleTabChange("all")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          <Bell className="h-4 w-4" />
          <span>All ({notifications.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("unread")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            activeTab === "unread" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          <Mail className="h-4 w-4" />
          <span>Unread ({unreadNotifications.length})</span>
        </button>

        <button
          onClick={() => handleTabChange("read")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            activeTab === "read" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          <MailOpen className="h-4 w-4" />
          <span>Read ({notifications.filter((n) => n.status === "read").length})</span>
        </button>
      </div>

      {isLoading && <div className="text-center">Loading notifications...</div>}
      {error && <div className="text-red-500 text-center">Error: {error.message}</div>}
      {!isLoading && !error && filteredNotifications.length === 0 && (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No notifications found.</p>
        </div>
      )}
      {!isLoading &&
        !error &&
        filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={cn(
              "border-b pb-3 mb-3 last:border-b-0 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md relative",
              notification.status === "unread"
                ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                : "bg-white border-gray-200 hover:bg-gray-50",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-2">
                  <h4
                    className={cn(
                      "text-sm font-medium flex-1",
                      notification.status === "unread" ? "text-gray-900" : "text-gray-700",
                    )}
                  >
                    {notification.title}
                  </h4>
                  <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{notification.message}</p>
                <div className="flex items-center gap-2 flex-wrap">
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

              {/* Actions Menu */}
              <div className="relative">
                <button
                  onClick={(e) => toggleActions(notification.id, e)}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  title="More actions"
                >
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>

                {showActions === notification.id && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                    {notification.status === "unread" && (
                      <button
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        disabled={isMarkingAsRead}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                      >
                        <MailOpen className="h-3 w-3" />
                        Mark as Read
                      </button>
                    )}

                    <button
                      onClick={(e) => handleArchive(notification.id, e)}
                      disabled={isArchiving}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                    >
                      <Archive className="h-3 w-3" />
                      Archive
                    </button>

                    <button
                      onClick={(e) => handleDelete(notification.id, e)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  )

  // Update the filter logic for the new "read" tab
  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return roleBasedNotifications.filter((n) => n.status === "unread")
      case "read":
        return roleBasedNotifications.filter((n) => n.status === "read")
      default:
        return roleBasedNotifications
    }
  }

  const finalFilteredNotifications = filterNotificationsBySearch(getFilteredNotifications())

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <NotificationsContent />
    </div>
  )
}

export default Notifications
