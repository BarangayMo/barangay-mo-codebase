import type React from "react"
interface NotificationItemProps {
  avatar: string
  name: string
  message: React.ReactNode
  time: string
  badgeColor?: string
  badgeIcon?: React.ReactNode
  showActions?: boolean
  actions?: React.ReactNode
  backgroundColor?: string
}

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotificationItem({
  avatar,
  name,
  message,
  time,
  badgeColor,
  badgeIcon,
  showActions,
  actions,
  backgroundColor = "bg-white",
}: NotificationItemProps) {
  return (
    <div
      className={`w-full ${backgroundColor} py-3 px-2 sm:px-6 flex flex-col sm:flex-row items-start gap-2 border-b last:border-b-0`}
    >
      <div className="relative shrink-0">
        <img src={avatar || "/placeholder.svg"} className="w-12 h-12 rounded-full border-2 border-white" alt={name} />
        {badgeIcon && (
          <span
            className={`absolute -bottom-1 -right-1 rounded-full flex items-center justify-center ${badgeColor} w-7 h-7 border-2 border-white shadow`}
          >
            {badgeIcon}
          </span>
        )}
      </div>
      <div className="flex-1">
        <div className="text-[15px] leading-snug">
          <span className="font-bold">{name} </span>
          {message}
        </div>
        <div className="flex gap-2 items-center mt-2">{showActions && actions}</div>
        <div className="text-gray-500 text-xs mt-0.5">{time}</div>
      </div>
      <div className="ml-auto flex items-start mt-1">
        <Button variant="ghost" size="icon" className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
