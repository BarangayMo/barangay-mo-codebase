
import { Logo } from "./sidebar/Logo";
import { HelpSection } from "./sidebar/HelpSection";
import { EnhancedSidebar } from "./EnhancedSidebar";

export const DesktopSidebar = () => {
  return (
    <div className="hidden md:block w-64 fixed top-0 left-0 h-full bg-white border-r shadow-sm z-20">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-4 border-b">
          <Logo />
        </div>
      
        <div className="flex-1 overflow-hidden">
          <EnhancedSidebar />
        </div>
      
        <HelpSection />
      </div>
    </div>
  );
};
