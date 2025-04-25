
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "./Header";
import { MobileNavbar } from "./MobileNavbar";
import { DesktopSidebar } from "./DesktopSidebar";
import { Footer } from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode, Suspense, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { LoadingScreen } from "../ui/loading";
import { HomePageSkeleton, MarketplaceSkeleton, MessagesSkeleton } from "../ui/page-skeleton";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export const Layout = ({ children, hideHeader = false, hideFooter = false }: LayoutProps) => {
  const { isAuthenticated, userRole } = useAuth();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Only show footer on mobile for homepage
  const shouldShowFooter = !hideFooter && (!isMobile || pathname === '/');

  useEffect(() => {
    // Simulate loading for at least 2 seconds when route changes
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const showSidebar = isAuthenticated && 
    (pathname.startsWith("/admin") || pathname.includes("smarketplace")) && 
    !isMobile && 
    userRole === "superadmin";

  // Determine which skeleton to show based on the current route
  const renderSkeleton = () => {
    if (pathname.includes('marketplace')) {
      return <MarketplaceSkeleton />;
    } else if (pathname.includes('messages')) {
      return <MessagesSkeleton />;
    } else {
      return <HomePageSkeleton />;
    }
  };

  const content = (
    <>
      {showSidebar && (
        <SidebarProvider>
          <DesktopSidebar />
        </SidebarProvider>
      )}
      <div
        className={cn(
          "flex flex-col min-h-screen w-full",
          showSidebar ? "md:pl-64" : ""
        )}
      >
        {!hideHeader && <Header />}
        <main className={cn(
          "flex-grow",
          isMobile ? "pb-20" : ""
        )}>
          {isLoading ? (
            renderSkeleton()
          ) : (
            <Suspense fallback={<LoadingScreen />}>
              {children}
            </Suspense>
          )}
        </main>
        {isMobile && <MobileNavbar />}
        {shouldShowFooter && <Footer />}
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {content}
    </div>
  );
};
