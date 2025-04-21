
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "./Header";
import { MobileNavbar } from "./MobileNavbar";
import { DesktopSidebar } from "./DesktopSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, userRole } = useAuth();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar (hidden on mobile) */}
      {isAuthenticated && !isMobile && <DesktopSidebar />}
      
      {/* Main Content */}
      <div
        className={cn(
          "flex flex-col min-h-screen w-full",
          isAuthenticated && !isMobile ? "md:pl-64" : ""
        )}
      >
        <Header />
        
        <main className={cn(
          "flex-grow",
          isMobile ? "pb-20" : "pb-6" // Add padding at the bottom for mobile navbar
        )}>
          {children}
        </main>
        
        {/* Mobile Navigation (visible only on mobile) */}
        {isMobile && <MobileNavbar />}
      </div>
    </div>
  );
};
