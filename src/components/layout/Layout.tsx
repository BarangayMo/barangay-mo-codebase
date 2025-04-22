import { useAuth } from "@/contexts/AuthContext";
import { Header } from "./Header";
import { MobileNavbar } from "./MobileNavbar";
import { DesktopSidebar } from "./DesktopSidebar";
import { Footer } from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { LoadingScreen } from "../ui/loading";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, userRole } = useAuth();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();

  const showSidebar = isAuthenticated && pathname === "/admin" && !isMobile && userRole === "superadmin";

  return (
    <div className="flex min-h-screen bg-gray-50 w-full overflow-x-hidden">
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
          isMobile ? "pb-20" : ""
        )}>
          <Suspense fallback={<LoadingScreen />}>
            {children}
          </Suspense>
        </main>
        {isMobile && <MobileNavbar />}
        <Footer />
      </div>
    </div>
  );
};
