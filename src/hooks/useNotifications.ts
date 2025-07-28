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
      return data as Notification[]
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log("Marking notification as read:", notificationId)
      const { error } = await supabase
        .from("notifications")
        .update({
          status: "read",
          read_at: new Date().toISOString(),
        })
        .eq("id", notificationId)

      if (error) {
        console.error("Error marking as read:", error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })

  const archiveNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({
          status: "archived",
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
    unarchiveNotification: unarchiveNotificationMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isArchiving: archiveNotificationMutation.isPending,
    isUnarchiving: unarchiveNotificationMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  }
}
