
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "./Header";
import { MobileNavbar } from "./MobileNavbar";
import { DesktopSidebar } from "./DesktopSidebar";
import { Footer } from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode, Suspense, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { LoadingScreen } from "../ui/loading";
import { HomePageSkeleton, MarketplaceSkeleton, MessagesSkeleton } from "../ui/page-skeleton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  hideMobileNavbar?: boolean;
}

// Animation variants
const pageVariants = {
  initial: { 
    opacity: 0,
    x: 10,
  },
  animate: { 
    opacity: 1,
    x: 0,
    transition: { 
      duration: 0.2, // Reduced from 0.3
      ease: "easeInOut" 
    }
  },
  exit: { 
    opacity: 0,
    x: -10,
    transition: { 
      duration: 0.1 // Reduced from 0.2
    }
  }
};

export const Layout = ({ children, hideHeader = false, hideFooter = false, hideMobileNavbar = false }: LayoutProps) => {
  const { isAuthenticated, userRole } = useAuth();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false); // Changed from true to false
  
  // Prevent loading screen on tab visibility change
  const previousPathRef = useRef(pathname);
  const isVisibilityChange = useRef(false);

  console.log('Layout rendering:', { pathname, isLoading, isAuthenticated });

  // Only show footer on mobile for homepage
  const shouldShowFooter = !hideFooter && (!isMobile || pathname === '/');

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        isVisibilityChange.current = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    // Significantly reduce loading times and only show loading for genuine navigation
    if (pathname !== previousPathRef.current && !isVisibilityChange.current) {
      console.log('Path changed, showing loading:', { from: previousPathRef.current, to: pathname });
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        console.log('Loading completed for:', pathname);
      }, 200); // Reduced from 800ms
      return () => clearTimeout(timer);
    } else {
      // Reset visibility change flag
      isVisibilityChange.current = false;
      // Don't show loading state for visibility changes
      setIsLoading(false);
    }
    
    // Update previous path
    previousPathRef.current = pathname;
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 w-full overflow-x-hidden">
        {showSidebar && <DesktopSidebar />}
        <div className={cn(
          "flex flex-col min-h-screen w-full",
          showSidebar ? "md:pl-64" : ""
        )}>
          {!hideHeader && <Header />}
          <main className={cn(
            "flex-grow",
            isMobile && !hideMobileNavbar ? "pb-20" : ""
          )}>
            {isLoading ? (
              renderSkeleton()
            ) : (
              <Suspense fallback={<LoadingScreen />}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    className="w-full h-full"
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            )}
          </main>
          {isMobile && !hideMobileNavbar && <MobileNavbar />}
          {shouldShowFooter && <Footer />}
        </div>
      </div>
    </SidebarProvider>
  );
};
