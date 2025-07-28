"use client"

import React, { useState, useEffect, useRef } from "react"
import { BellIcon } from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { usePopper } from "react-popper"
import { useAuth } from "@/contexts/AuthContext"
import type { INotification } from "@/interfaces/INotification"

interface NotificationDropdownProps {
  notifications: INotification[]
  onMarkAsRead: (id: string) => void
  onClearAll: () => void
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onMarkAsRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { user } = useAuth()
  const userRole = user?.role || "guest" // Default to 'guest' if user or role is undefined

  const { styles, attributes } = usePopper(buttonRef.current, dropdownRef.current, {
    placement: "bottom-end",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 4],
        },
      },
    ],
  })

  useEffect(() => {
    if (!isOpen) return

    const { styles: newStyles, attributes: newAttributes } = usePopper(buttonRef.current, dropdownRef.current, {
      placement: "bottom-end",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 4],
          },
        },
      ],
    })

    styles.popper = newStyles.popper
    attributes.popper = newAttributes.popper
  }, [isOpen])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Role-based filtering and search logic
  const filteredNotifications = React.useMemo(() => {
    // Updated role-based filtering to match the main notifications page
    const roleBasedNotifications = notifications.filter((notification) => {
      // General notifications are visible to everyone
      if (notification.category === "general" || notification.category === "system") {
        return true
      }

      const shouldShow = false
      switch (userRole) {
        case "superadmin":
          // Superadmins can see all notifications
          return true
        case "official":
          // Officials can see work-related notifications + job/product/community
          return [
            "task",
            "deadline",
            "milestone",
            "message",
            "finance",
            "meeting",
            "project",
            "feedback",
            "job",
            "product",
            "community",
            "job_posting",
            "product_listing",
            "community_post",
          ].includes(notification.category)
        case "resident":
          // Residents can see personal and approval notifications + job/product/community
          return [
            "approval",
            "message",
            "feedback",
            "registration",
            "job",
            "product",
            "community",
            "job_posting",
            "product_listing",
            "community_post",
          ].includes(notification.category)
        default:
          // Fallback: show general notifications for any unrecognized role
          return ["general", "system"].includes(notification.category)
      }
    })

    console.log("NotificationDropdown filtering:", {
      total: notifications.length,
      afterRoleFilter: roleBasedNotifications.length,
      userRole,
      categories: [...new Set(notifications.map((n) => n.category))],
      filteredCategories: [...new Set(roleBasedNotifications.map((n) => n.category))],
    })

    const searchFiltered = roleBasedNotifications.filter((notification) =>
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    console.log("NotificationDropdown: Filtering results:", {
      total: notifications.length,
      afterRoleFilter: roleBasedNotifications.length,
      afterSearchFilter: searchFiltered.length,
      userRole,
      categories: [...new Set(notifications.map((n) => n.category))],
      filteredCategories: [...new Set(roleBasedNotifications.map((n) => n.category))],
    })

    return searchFiltered
  }, [notifications, searchTerm, userRole])

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="relative inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-6 w-6" aria-hidden="true" />
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          style={styles.popper}
          {...attributes.popper}
          className="absolute z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1" role="none">
            <div className="px-4 py-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                <button onClick={closeDropdown}>
                  <XMarkIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Search notifications"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {filteredNotifications.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-700">No notifications</div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabIndex={-1}
                >
                  <div className="flex justify-between">
                    <p>{notification.message}</p>
                    {!notification.read && (
                      <button
                        onClick={() => {
                          onMarkAsRead(notification.id)
                        }}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            <div className="border-t border-gray-100">
              <div className="px-4 py-2">
                <button onClick={onClearAll} className="text-sm text-gray-700 hover:bg-gray-100 block w-full text-left">
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
