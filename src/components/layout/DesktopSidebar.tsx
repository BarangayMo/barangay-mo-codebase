
import { Logo } from "./sidebar/Logo";
import { HelpSection } from "./sidebar/HelpSection";
import { EnhancedSidebar } from "./EnhancedSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

export const DesktopSidebar = () => {
  const { userRole } = useAuth();
  
  return (
    <SidebarProvider>
      <div className={`hidden md:block w-64 fixed top-0 left-0 h-full bg-white shadow-sm z-20 ${
        userRole === "official" ? "border-r border-red-100" : "border-r border-gray-200"
      }`}>
        <div className="flex flex-col h-full">
          <div className={`flex items-center justify-center h-16 px-4 ${
            userRole === "official" ? "border-b border-red-100" : "border-b border-gray-200"
          }`}>
            <Logo />
          </div>
        
          <div className="flex-1 overflow-hidden">
            <EnhancedSidebar />
          </div>
        
          <HelpSection />
        </div>
      </div>
    </SidebarProvider>
  );
};
