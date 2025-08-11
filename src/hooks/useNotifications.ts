"use client"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  category: string
  priority: string
  status: string
  type?: string
  action_url?: string
  created_at: string
  read_at?: string
  sender_id?: string
  recipient_id: string
  metadata?: any
  updated_at: string
}

export const useNotifications = () => {
  const { user, userRole } = useAuth()
  const queryClient = useQueryClient()

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) return

    console.log("Setting up real-time subscription for user:", user.id)

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Real-time notification update:", payload)
          queryClient.invalidateQueries({ queryKey: ["notifications"] })
        },
      )
      .subscribe()

    return () => {
      console.log("Cleaning up real-time subscription")
      supabase.removeChannel(channel)
    }
  }, [user?.id, queryClient])

  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications", user?.id, userRole],
    queryFn: async () => {
      if (!user?.id) {
        console.log("No user ID available")
        return []
      }

      console.log("Fetching notifications for user:", user.id)

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_id", user.id)
        .neq("status", "archived")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching notifications:", error)
        throw error
      }

      console.log("Raw notifications from DB:", data?.length || 0, data)

      // Remove duplicates based on title, message, and category
      const uniqueNotifications =
        data?.filter(
          (notification, index, self) =>
            index ===
            self.findIndex(
              (n) =>
                n.title === notification.title &&
                n.message === notification.message &&
                n.category === notification.category &&
                n.recipient_id === notification.recipient_id,
            ),
        ) || []

      console.log("After removing duplicates:", uniqueNotifications.length)

      return uniqueNotifications as Notification[]
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log("Marking notification as read:", notificationId)

      const { data, error } = await supabase
        .from("notifications")
        .update({
          status: "read",
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", notificationId)
        .select()

      if (error) {
        console.error("Error marking as read:", error)
        throw error
      }

      console.log("Successfully marked notification as read:", data)
      return data
    },
    onMutate: async (notificationId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notifications"] })

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData(["notifications", user?.id, userRole])

      // Optimistically update to the new value
      queryClient.setQueryData(["notifications", user?.id, userRole], (old: Notification[] | undefined) => {
        if (!old) return old
        return old.map((notification) =>
          notification.id === notificationId
            ? { ...notification, status: "read", read_at: new Date().toISOString() }
            : notification,
        )
      })

      // Return a context object with the snapshotted value
      return { previousNotifications }
    },
    onError: (err, notificationId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["notifications", user?.id, userRole], context?.previousNotifications)
      console.error("Failed to mark notification as read:", err)
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })

  const archiveNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log("Archiving notification:", notificationId)

      const { data, error } = await supabase
        .from("notifications")
        .update({
          status: "archived",
          updated_at: new Date().toISOString(),
        })
        .eq("id", notificationId)
        .select()

      if (error) {
        console.error("Error archiving notification:", error)
        throw error
      }

      console.log("Successfully archived notification:", data)
      return data
    },
    onMutate: async (notificationId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notifications"] })

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData(["notifications", user?.id, userRole])

      // Optimistically remove the notification from the list
      queryClient.setQueryData(["notifications", user?.id, userRole], (old: Notification[] | undefined) => {
        if (!old) return old
        return old.filter((notification) => notification.id !== notificationId)
      })

      // Return a context object with the snapshotted value
      return { previousNotifications }
    },
    onError: (err, notificationId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["notifications", user?.id, userRole], context?.previousNotifications)
      console.error("Failed to archive notification:", err)
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log("Deleting notification:", notificationId)

      const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

      if (error) {
        console.error("Error deleting notification:", error)
        throw error
      }

      console.log("Successfully deleted notification:", notificationId)
    },
    onMutate: async (notificationId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notifications"] })

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData(["notifications", user?.id, userRole])

      // Optimistically remove the notification from the list
      queryClient.setQueryData(["notifications", user?.id, userRole], (old: Notification[] | undefined) => {
        if (!old) return old
        return old.filter((notification) => notification.id !== notificationId)
      })

      // Return a context object with the snapshotted value
      return { previousNotifications }
    },
    onError: (err, notificationId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["notifications", user?.id, userRole], context?.previousNotifications)
      console.error("Failed to delete notification:", err)
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })

  const unarchiveNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({
          status: "read",
          updated_at: new Date().toISOString(),
        })
        .eq("id", notificationId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["archivedNotifications"] })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return

      const { error } = await supabase
        .from("notifications")
        .update({
          status: "read",
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("recipient_id", user.id)
        .eq("status", "unread")

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })

  const { data: archivedNotifications = [] } = useQuery({
    queryKey: ["archivedNotifications", user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_id", user.id)
        .eq("status", "archived")
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error fetching archived notifications:", error)
        throw error
      }

      return data as Notification[]
    },
    enabled: !!user?.id,
  })

  const unreadCount = notifications.filter((n) => n.status === "unread").length

  // Log current state for debugging
  useEffect(() => {
    console.log("Notifications state:", {
      total: notifications.length,
      unread: unreadCount,
      categories: [...new Set(notifications.map((n) => n.category))],
      notifications: notifications.map((n) => ({ id: n.id, title: n.title, category: n.category, status: n.status })),
    })
  }, [notifications.length, unreadCount])

  return {
    notifications,
    archivedNotifications,
    isLoading,
    error,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    archiveNotification: archiveNotificationMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    unarchiveNotification: unarchiveNotificationMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isArchiving: archiveNotificationMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
    isUnarchiving: unarchiveNotificationMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  }
}
