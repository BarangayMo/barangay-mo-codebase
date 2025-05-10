
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { EnhancedSidebar } from "./EnhancedSidebar";
import { Button } from "../ui/button";
import { MessageSquare, Bell } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { ProfileMenu } from "./ProfileMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
}

export function AdminLayout({ children, title = "Admin", fullWidth = false }: AdminLayoutProps) {
  const { isSidebarOpen, toggleSidebar } = useSidebarState();
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Set document title
  useEffect(() => {
    document.title = `${title} - Admin Dashboard`;
  }, [title]);

  // Navigate to messages page when message icon is clicked
  const handleMessagesClick = () => {
    navigate('/admin/messages');
  };
  
  // Navigate to notifications when bell icon is clicked
  const handleNotificationsClick = () => {
    navigate('/admin/notifications');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <EnhancedSidebar isOpen={isSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Helmet>
          <title>{title} - Admin Dashboard</title>
        </Helmet>
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between border-b px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M3 7h18" />
                <path d="M3 12h18" />
                <path d="M3 17h18" />
              </svg>
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <h1 className="font-semibold text-lg">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMessagesClick}
              className={
                location.pathname.includes('/admin/messages') 
                  ? "bg-secondary" 
                  : ""
              }
            >
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationsClick}
              className={
                location.pathname.includes('/admin/notifications') 
                  ? "bg-secondary" 
                  : ""
              }
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <ThemeToggle />
            <ProfileMenu />
          </div>
        </header>
        
        {/* Main Content */}
        <main className={`flex-1 overflow-auto ${fullWidth ? "" : "container py-4 md:py-6 lg:py-8"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
