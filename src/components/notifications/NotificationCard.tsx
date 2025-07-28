"use client"

import { formatDistanceToNow } from "date-fns"
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Archive,
  ExternalLink,
  MessageSquare,
  FileText,
  Users,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import type { Notification } from "@/hooks/useNotifications"

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onArchive: (id: string) => void
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "system":
    case "general":
      return <Info className="h-4 w-4" />
    case "registration":
      return <UserCheck className="h-4 w-4" />
    case "message":
    case "feedback":
      return <MessageSquare className="h-4 w-4" />
    case "finance":
    case "approval":
      return <FileText className="h-4 w-4" />
    case "meeting":
      return <Users className="h-4 w-4" />
    case "project":
    case "milestone":
      return <CheckCircle className="h-4 w-4" />
    case "task":
    case "deadline":
      return <AlertTriangle className="h-4 w-4" />
    case "community":
      return <Users className="h-4 w-4" />
    case "job":
      return <FileText className="h-4 w-4" />
    case "service":
      return <Users className="h-4 w-4" />
    case "product":
      return <FileText className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-500"
    case "high":
      return "bg-orange-500"
    case "normal":
      return "bg-blue-500"
    case "low":
      return "bg-gray-500"
    default:
      return "bg-blue-500"
  }
}

export const NotificationCard = ({ notification, onMarkAsRead, onArchive }: NotificationCardProps) => {
  const isUnread = notification.status === "unread"

  const handleMarkAsRead = () => {
    if (isUnread) {
      onMarkAsRead(notification.id)
    }
  }

  const handleArchive = () => {
    onArchive(notification.id)
  }

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-200 hover:shadow-md",
        isUnread ? "bg-blue-50 border-blue-200" : "bg-white",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex-shrink-0 p-2 rounded-full",
            isUnread ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600",
          )}
        >
          {getCategoryIcon(notification.category)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={cn("font-medium text-sm", isUnread ? "text-gray-900" : "text-gray-700")}>
                  {notification.title}
                </h3>
                {isUnread && <div className={cn("w-2 h-2 rounded-full", getPriorityColor(notification.priority))} />}
              </div>

              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Badge variant="secondary" className="text-xs">
                  {notification.category}
                </Badge>
                <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {notification.action_url && (
                <Button asChild variant="ghost" size="sm">
                  <Link to={notification.action_url}>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              )}

              {isUnread && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAsRead}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
              )}

              <Button variant="ghost" size="sm" onClick={handleArchive} className="text-gray-500 hover:text-gray-700">
                <Archive className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
