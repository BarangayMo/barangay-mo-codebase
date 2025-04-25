
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { EnhancedSidebar } from "./EnhancedSidebar";

export const DesktopSidebar = () => {
  return (
    <div className="hidden md:block w-64 fixed top-0 left-0 h-full bg-white border-r shadow-sm z-20">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-4 border-b">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/d6bf0909-f59b-42dc-8d79-b45a400a1081.png" 
              alt="Logo" 
              className="h-8 w-8" 
            />
            <span className="ml-2 text-lg font-semibold">Barangay System</span>
          </Link>
        </div>
      
        <div className="flex-1 overflow-hidden">
          <EnhancedSidebar />
        </div>
      
        <div className="px-3 mt-auto">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Home className="w-4 h-4 text-blue-600" />
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
