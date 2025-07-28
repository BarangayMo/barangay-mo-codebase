"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface Notification {
  id: string
  title: string
  description: string
  avatar_url: string
  action_url: string
}

interface NotificationCardProps {
  notification: Notification
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  return (
    <Card className="w-[380px] dark:bg-zinc-950">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={notification.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{notification.title}</CardTitle>
            <CardDescription>{notification.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="justify-end">
        {notification.action_url && (
          <Button variant="ghost" size="sm" onClick={() => window.open(notification.action_url, "_blank")}>
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default NotificationCard
