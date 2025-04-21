
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export const DesktopSidebar = () => {
  const { pathname } = useLocation();

  const mainMenuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin"
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/admin/reports",
      submenu: [
        { title: "Financial Reports", path: "/admin/reports/financial" },
        { title: "Activity Logs", path: "/admin/reports/activity" },
      ]
    },
    {
      title: "User Management",
      icon: Users,
      path: "/admin/users",
      submenu: [
        { title: "Residents", path: "/admin/users/residents" },
        { title: "Officials", path: "/admin/users/officials" },
      ]
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings"
    }
  ];

  const isActive = (path: string) => 
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="hidden md:block w-64 min-h-screen bg-white border-r fixed top-0 left-0 pt-16 pb-6">
      <div className="flex flex-col h-full">
        <div className="flex-1 px-3 py-2 overflow-y-auto">
          <div className="space-y-1">
            {mainMenuItems.map((item) => (
              item.submenu ? (
                <Collapsible key={item.path} className="w-full">
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pl-9 pr-2 pb-2">
                      {item.submenu.map((subitem) => (
                        <Link 
                          key={subitem.path} 
                          to={subitem.path}
                          className={cn(
                            "block p-2 text-sm rounded-lg",
                            isActive(subitem.path) 
                              ? "bg-blue-50 text-blue-600" 
                              : "hover:bg-gray-100"
                          )}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 p-2 text-sm rounded-lg",
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            ))}
          </div>
        </div>
        
        <div className="px-3 mt-auto">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Need help?</p>
                <p className="text-xs text-gray-500">Contact support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
