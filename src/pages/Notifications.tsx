"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase"
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore"
import { useSearch } from "../contexts/SearchContext"
import { useDebounce } from "../hooks/useDebounce"
import NotificationItem from "./NotificationItem"
import { cn } from "@/lib/utils"
import { Bell, Clock, AlertTriangle, Briefcase, Settings } from "lucide-react"

// Define the Notification type
interface Notification {
  id: string
  title: string
  message: string
  timestamp: any
  read: boolean
  category: string
  userId: string
  data?: any
}

const Notifications = () => {
  const { currentUser } = useAuth()
  const { searchTerm } = useSearch()
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([])
  const [urgentNotifications, setUrgentNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid)

      const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUserRole(docSnapshot.data()?.role || "resident") // Default to 'resident' if role is not defined
        } else {
          setUserRole("resident") // Default if user doc doesn't exist
        }
      })

      return () => unsubscribeUser()
    } else {
      setUserRole(null)
    }
  }, [currentUser])

  useEffect(() => {
    if (currentUser) {
      setLoading(true)
      setError(null)

      const notificationsRef = collection(db, "notifications")
      const q = query(notificationsRef, where("userId", "==", currentUser.uid))

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const notificationsData: Notification[] = querySnapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as Notification,
          )

          // Sort notifications by timestamp in descending order (newest first)
          notificationsData.sort((a, b) => b.timestamp - a.timestamp)

          setNotifications(notificationsData)
          setLoading(false)
        },
        (error) => {
          console.error("Error fetching notifications:", error)
          setError("Failed to fetch notifications. Please try again.")
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } else {
      setNotifications([])
      setLoading(false)
    }
  }, [currentUser])

  useEffect(() => {
    setUnreadNotifications(notifications.filter((notification) => !notification.read))
    setUrgentNotifications(notifications.filter((notification) => notification.category === "urgent"))
  }, [notifications])

  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId)
      await updateDoc(notificationRef, { read: true })
      // Optimistically update the local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
      setUnreadNotifications(unreadNotifications.filter((notification) => notification.id !== notificationId))
    } catch (error) {
      console.error("Error marking as read:", error)
      setError("Failed to mark as read. Please try again.")
    }
  }

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
    if (!debouncedSearchTerm) {
      return notificationList
    }

    const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase()
    return notificationList.filter(
      (notification) =>
        notification.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        notification.message.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }

  const currentNotifications = activeTab === "all" ? notifications : unreadNotifications
  const roleBasedNotifications = filterNotificationsByRole(currentNotifications)
  const filteredNotifications = filterNotificationsBySearch(roleBasedNotifications)

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
      read: n.read,
    })),
  })

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
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

      {loading && <div className="text-center">Loading notifications...</div>}
      {error && <div className="text-red-500 text-center">Error: {error}</div>}
      {!loading && !error && filteredNotifications.length === 0 && (
        <div className="text-center">No notifications found.</div>
      )}
      {!loading &&
        !error &&
        filteredNotifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} markAsRead={markAsRead} />
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
