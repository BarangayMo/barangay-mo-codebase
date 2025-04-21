
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Briefcase,
  ShoppingCart,
  Users,
  Settings,
  FileText,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const DesktopSidebar = () => {
  const { pathname } = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin"
    },
    {
      title: "Overview",
      icon: Home,
      path: "/admin/overview"
    },
    {
      title: "Expenses",
      icon: FileText,
      path: "/admin/expenses"
    },
    {
      title: "Accounts",
      icon: Users,
      path: "/admin/accounts"
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/admin/reports"
    },
    {
      title: "Approvals",
      icon: FileText,
      path: "/admin/approvals"
    },
    {
      title: "Payments",
      icon: FileText,
      path: "/admin/payments"
    },
    {
      title: "Recipients",
      icon: Users,
      path: "/admin/recipients"
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings"
    },
    {
      title: "Help",
      icon: HelpCircle,
      path: "/admin/help"
    }
  ];

  const getActiveClass = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(`${path}/`);
    return isActive ? 'bg-primary/10 text-primary font-medium' : '';
  };

  return (
    <div className="hidden md:block w-64 h-screen bg-[#1A1F2C] fixed top-0 left-0 pt-16 pb-6 text-white">
      <div className="flex flex-col h-full overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-left text-gray-300 hover:text-white font-normal py-2", 
                  getActiveClass(item.path)
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
