"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useNotifications } from "@/hooks/useNotifications"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import {
  Bell,
  Archive,
  Trash2,
  ExternalLink,
  Mail,
  MailOpen,
  MoreVertical,
  ArrowLeft,
  Search,
  Settings,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Notification } from "@/hooks/useNotifications"

const Notifications = () => {
  const navigate = useNavigate()
  const { user, userRole } = useAuth()
  const {
    notifications,
    archivedNotifications,
    isLoading,
    error,
    unreadCount,
    markAsRead,
    archiveNotification,
    unarchiveNotification,
    markAllAsRead,
    isMarkingAsRead,
    isArchiving,
    isUnarchiving,
    isMarkingAllAsRead,
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

  // Get the appropriate notification list based on active tab
  const getNotificationsByTab = () => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => n.status === "unread")
      case "read":
        return notifications.filter((n) => n.status === "read")
      case "archived":
        return archivedNotifications
      default:
        return notifications
    }
  }

  const currentNotifications = getNotificationsByTab()
  const roleBasedNotifications =
    activeTab === "archived" ? currentNotifications : filterNotificationsByRole(currentNotifications)
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
    archivedCount: archivedNotifications.length,
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
    setShowActions(null) // Close any open action menus
  }

  const handleMarkAsRead = (notificationId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation() // Prevent notification click when clicking mark as read
    }
    console.log("Attempting to mark as read:", notificationId)
    markAsRead(notificationId)
    setShowActions(null)
  }

  const handleArchive = (notificationId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    console.log("Attempting to archive:", notificationId)
    archiveNotification(notificationId)
    setShowActions(null)
  }

  const handleUnarchive = (notificationId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    console.log("Attempting to unarchive:", notificationId)
    unarchiveNotification(notificationId)
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

    // Don't navigate if it's archived, just show it
    if (notification.status === "archived") {
      return
    }

    // Mark as read if it's unread
    if (notification.status === "unread") {
      markAsRead(notification.id)
    }

    // Navigate to the action URL if it exists
    if (notification.action_url) {
      window.open(notification.action_url, "_blank")
    } else {
      // Generate specific URLs based on category and metadata
      let defaultUrl = ""

      // Try to get the specific ID from metadata
      const metadata = notification.metadata || {}
      const jobId = metadata.job_id
      const productId = metadata.product_id
      const serviceId = metadata.service_id
      const communityId = metadata.community_id || metadata.post_id

      switch (notification.category) {
        case "jobs":
        case "job":
        case "job_posting":
          if (jobId) {
            defaultUrl = `/jobs/${jobId}`
          } else {
            defaultUrl = "/jobs"
          }
          break
        case "services":
        case "service":
          if (serviceId) {
            defaultUrl = `/services/${serviceId}`
          } else {
            defaultUrl = "/services"
          }
          break
        case "community":
        case "community_post":
          if (communityId) {
            defaultUrl = `/community/posts/${communityId}`
          } else {
            defaultUrl = "/community"
          }
          break
        case "product":
        case "product_listing":
          if (productId) {
            defaultUrl = `/products/${productId}`
          } else {
            defaultUrl = "/products"
          }
          break
        default:
          defaultUrl = "/dashboard"
      }

      console.log("Navigating to:", defaultUrl, "with metadata:", metadata)

      // Use React Router navigate instead of window.location.href
      navigate(defaultUrl)
    }
  }

  const toggleActions = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setShowActions(showActions === notificationId ? null : notificationId)
  }

  const handleBackToDashboard = () => {
    const role = user?.role || userRole // Use whichever property contains the role

    // Navigate to role-specific dashboard using React Router
    if (role === "resident") {
      navigate("/resident/home")
    } else if (role === "official") {
      navigate("/official-dashboard")
    } else if (role === "super-admin" || role === "superadmin") {
      navigate("/admin/dashboard")
    } else {
      navigate("/dashboard") // fallback
    }
  }

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsRead()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back button and title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block" />
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAllAsRead}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Mark All Read</span>
                </Button>
              )}
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Stats and Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
                    <div className="text-sm text-blue-600">Total</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
                    <div className="text-sm text-orange-600">Unread</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {notifications.filter((n) => n.status === "read").length}
                    </div>
                    <div className="text-sm text-green-600">Read</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{archivedNotifications.length}</div>
                    <div className="text-sm text-purple-600">Archived</div>
                  </div>
                </div>

                {/* User Info */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">Logged in as:</div>
                    <div className="text-gray-900">{user?.email}</div>
                    <div className="text-xs text-gray-500 mt-1">Role: {userRole}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg">Your Notifications</CardTitle>

                  {/* Search Bar */}
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 flex-wrap pt-4">
                  <Button
                    variant={activeTab === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTabChange("all")}
                    className="flex items-center gap-2"
                  >
                    <Bell className="h-3 w-3" />
                    <span>All ({notifications.length})</span>
                  </Button>

                  <Button
                    variant={activeTab === "unread" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTabChange("unread")}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-3 w-3" />
                    <span>Unread ({unreadNotifications.length})</span>
                  </Button>

                  <Button
                    variant={activeTab === "read" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTabChange("read")}
                    className="flex items-center gap-2"
                  >
                    <MailOpen className="h-3 w-3" />
                    <span>Read ({notifications.filter((n) => n.status === "read").length})</span>
                  </Button>

                  <Button
                    variant={activeTab === "archived" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTabChange("archived")}
                    className="flex items-center gap-2"
                  >
                    <Archive className="h-3 w-3" />
                    <span>Archived ({archivedNotifications.length})</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {/* Debug Info - Remove this in production */}
                {process.env.NODE_ENV === "development" && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                    <strong>Debug Info:</strong> Total: {notifications.length}, Role-filtered:{" "}
                    {roleBasedNotifications.length}, Search-filtered: {filteredNotifications.length}, Unread:{" "}
                    {unreadNotifications.length}, Archived: {archivedNotifications.length}, Categories:{" "}
                    {[...new Set(notifications.map((n) => n.category))].join(", ")}
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading notifications...</p>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-4">
                      <Bell className="h-8 w-8 mx-auto mb-2" />
                      <p>Error loading notifications</p>
                      <p className="text-sm">{error.message}</p>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredNotifications.length === 0 && (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {activeTab === "archived" ? "No archived notifications" : "No notifications found"}
                    </h3>
                    <p className="text-gray-500">
                      {activeTab === "archived"
                        ? "Archived notifications will appear here."
                        : searchTerm
                          ? "Try adjusting your search terms."
                          : "New notifications will appear here when they arrive."}
                    </p>
                  </div>
                )}

                {/* Notifications List */}
                {!isLoading && !error && filteredNotifications.length > 0 && (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "p-4 rounded-lg border transition-all duration-200 hover:shadow-md relative",
                          notification.status === "unread"
                            ? "bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer"
                            : notification.status === "archived"
                              ? "bg-purple-50 border-purple-200 hover:bg-purple-100"
                              : "bg-white border-gray-200 hover:bg-gray-50 cursor-pointer",
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
                              {notification.status !== "archived" && (
                                <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{notification.message}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleString()}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {notification.category}
                              </Badge>
                              <Badge
                                variant={
                                  notification.status === "unread"
                                    ? "destructive"
                                    : notification.status === "archived"
                                      ? "secondary"
                                      : "outline"
                                }
                                className="text-xs"
                              >
                                {notification.status}
                              </Badge>
                              {notification.priority && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.priority}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Actions Menu */}
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => toggleActions(notification.id, e)}
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>

                            {showActions === notification.id && (
                              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                                {notification.status === "unread" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                    disabled={isMarkingAsRead}
                                    className="w-full justify-start text-left text-sm hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 rounded-none"
                                  >
                                    <MailOpen className="h-3 w-3" />
                                    Mark as Read
                                  </Button>
                                )}

                                {notification.status === "archived" ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleUnarchive(notification.id, e)}
                                    disabled={isUnarchiving}
                                    className="w-full justify-start text-left text-sm hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 rounded-none"
                                  >
                                    <Archive className="h-3 w-3" />
                                    Unarchive
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleArchive(notification.id, e)}
                                    disabled={isArchiving}
                                    className="w-full justify-start text-left text-sm hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 rounded-none"
                                  >
                                    <Archive className="h-3 w-3" />
                                    Archive
                                  </Button>
                                )}

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleDelete(notification.id, e)}
                                  className="w-full justify-start text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 rounded-none"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
