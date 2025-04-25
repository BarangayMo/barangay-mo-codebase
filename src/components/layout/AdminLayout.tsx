
import { ReactNode, useEffect } from "react";
import { EnhancedSidebar } from "./EnhancedSidebar";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ensure we're always scrolled to the top when navigating
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <EnhancedSidebar />
      </div>
      
      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-20 border-b px-4 py-3 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <img 
          src="/lovable-uploads/d6bf0909-f59b-42dc-8d79-b45a400a1081.png" 
          alt="Logo" 
          className="h-8 w-8 mx-auto" 
        />
      </div>
      
      {/* Mobile Sidebar Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0">
          <EnhancedSidebar />
        </SheetContent>
      </Sheet>
      
      <div className="flex flex-col min-h-screen w-full md:pl-64 transition-all">
        <Helmet>
          <title>{title} - Smarketplace Admin</title>
        </Helmet>
        <main className="flex-grow">
          <div className="container py-6 pt-16 md:pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
