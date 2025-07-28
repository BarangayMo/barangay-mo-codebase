import type React from "react"
import { Bell, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Link } from "react-router-dom"

interface Notification {
  id: string
  title: string
  description: string
  avatar_url?: string
  action_url?: string
  created_at: string
}

interface NotificationCardProps {
  notification: Notification
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{notification.title}</CardTitle>
        <Bell className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardDescription>{notification.description}</CardDescription>
      <CardFooter className="flex justify-between">
        <Avatar>
          {notification.avatar_url ? (
            <AvatarImage src={notification.avatar_url || "/placeholder.svg"} />
          ) : (
            <AvatarFallback>{notification.title.substring(0, 2).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
        <div className="text-xs text-muted-foreground">{notification.created_at}</div>
        {notification.action_url && (
          <Button asChild variant="ghost" size="sm">
            <Link to={notification.action_url}>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default NotificationCard
