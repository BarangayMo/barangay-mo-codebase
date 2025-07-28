"use client"

import { Bell, CheckCircle2, Info, type LucideIcon, XCircle } from "lucide-react"
import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  icon: LucideIcon
  variant: "default" | "destructive" | "warning" | "info" | "success"
  read: boolean
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "New sign-in",
    description: "There was a login to your account from a new device.",
    time: "2 hours ago",
    icon: Info,
    variant: "info",
    read: false,
  },
  {
    id: "2",
    title: "Password changed",
    description: "Your password has been changed successfully.",
    time: "3 hours ago",
    icon: CheckCircle2,
    variant: "success",
    read: false,
  },
  {
    id: "3",
    title: "New sign-in",
    description: "There was a login to your account from a new device.",
    time: "2 hours ago",
    icon: Info,
    variant: "info",
    read: true,
  },
  {
    id: "4",
    title: "Password changed",
    description: "Your password has been changed successfully.",
    time: "3 hours ago",
    icon: CheckCircle2,
    variant: "success",
    read: true,
  },
  {
    id: "5",
    title: "Failed payment",
    description: "Your payment has failed. Please update your payment method.",
    time: "1 day ago",
    icon: XCircle,
    variant: "destructive",
    read: true,
  },
  {
    id: "6",
    title: "New sign-in",
    description: "There was a login to your account from a new device.",
    time: "2 hours ago",
    icon: Info,
    variant: "info",
    read: true,
  },
  {
    id: "7",
    title: "Password changed",
    description: "Your password has been changed successfully.",
    time: "3 hours ago",
    icon: CheckCircle2,
    variant: "success",
    read: true,
  },
  {
    id: "8",
    title: "Failed payment",
    description: "Your payment has failed. Please update your payment method.",
    time: "1 day ago",
    icon: XCircle,
    variant: "destructive",
    read: true,
  },
  {
    id: "9",
    title: "New sign-in",
    description: "There was a login to your account from a new device.",
    time: "2 hours ago",
    icon: Info,
    variant: "info",
    read: true,
  },
  {
    id: "10",
    title: "Password changed",
    description: "Your password has been changed successfully.",
    time: "3 hours ago",
    icon: CheckCircle2,
    variant: "success",
    read: true,
  },
  {
    id: "11",
    title: "Failed payment",
    description: "Your payment has failed. Please update your payment method.",
    time: "1 day ago",
    icon: XCircle,
    variant: "destructive",
    read: true,
  },
]

export function NotificationDropdown() {
  const [open, setOpen] = React.useState(false)

  const todayNotifications = notifications.filter((notification) => notification.time.includes("hour"))
  const yesterdayNotifications = notifications.filter((notification) => notification.time.includes("day"))
  const unreadNotifications = notifications.filter((notification) => !notification.read)
  const urgentNotifications = notifications.filter((notification) => notification.variant === "destructive")

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 rounded-full px-2 py-0.5 text-xs" variant="destructive">
              {unreadNotifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <div className="grid gap-2 px-4 py-2">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-sm text-muted-foreground">You have {unreadNotifications.length} unread messages</p>
        </div>
        <DropdownMenuSeparator />
        <Tabs defaultValue="all" className="m-2">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="urgent">Urgent</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="border-none p-0 outline-none">
            <div className="max-h-32">
              <ScrollArea className="h-32">
                <div className="flex flex-col space-y-1 p-4">
                  {todayNotifications.slice(0, 1).map((notification) => (
                    <div key={notification.id} className="flex items-center space-x-2">
                      <notification.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                      </div>
                    </div>
                  ))}
                  {yesterdayNotifications.slice(0, 1).map((notification) => (
                    <div key={notification.id} className="flex items-center space-x-2">
                      <notification.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="unread" className="border-none p-0 outline-none">
            <div className="max-h-32">
              <ScrollArea className="h-32">
                <div className="flex flex-col space-y-1 p-4">
                  {unreadNotifications.slice(0, 1).map((notification) => (
                    <div key={notification.id} className="flex items-center space-x-2">
                      <notification.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="urgent" className="border-none p-0 outline-none">
            <div className="max-h-32">
              <ScrollArea className="h-32">
                <div className="flex flex-col space-y-1 p-4">
                  {urgentNotifications.slice(0, 1).map((notification) => (
                    <div key={notification.id} className="flex items-center space-x-2">
                      <notification.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CheckCircle2 className="mr-2 h-4 w-4" /> Mark all as read
          <DropdownMenuShortcut>shift+a</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
