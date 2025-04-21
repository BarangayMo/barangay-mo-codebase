
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "./Header";
import { MobileNavbar } from "./MobileNavbar";
import { DesktopSidebar } from "./DesktopSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();

  // Only show sidebar on admin dashboard route
  const showSidebar = isAuthenticated && pathname === "/admin" && !isMobile;

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      {/* Desktop Sidebar (only in admin) */}
      {showSidebar && <DesktopSidebar />}
      <div
        className={cn(
          "flex flex-col min-h-screen w-full",
          showSidebar ? "md:pl-64" : ""
        )}
      >
        <Header />
        <main className={cn(
          "flex-grow",
          isMobile ? "pb-20" : "pb-6"
        )}>
          {children}
        </main>
        {!showSidebar && isMobile && <MobileNavbar />}
      </div>
    </div>
  );
};
