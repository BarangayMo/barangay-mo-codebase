
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Briefcase,
  ShoppingCart,
  MessageSquare,
  ChevronDown,
  Users,
  Settings,
  HelpCircle,
  FileText,
  LayoutDashboard
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const DesktopSidebar = () => {
  const { pathname } = useLocation();
  const { userRole } = useAuth();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getAccentColorClass = () => {
    switch (userRole) {
      case 'official':
        return 'text-official hover:bg-official-light';
      case 'resident':
        return 'text-resident hover:bg-resident-light';
      case 'superadmin':
        return 'text-primary hover:bg-primary/10';
      default:
        return 'text-primary hover:bg-primary/10';
    }
  };

  const getActiveClass = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(`${path}/`);
    
    if (isActive) {
      switch (userRole) {
        case 'official':
          return 'bg-official-light text-official font-medium';
        case 'resident':
          return 'bg-resident-light text-resident font-medium';
        case 'superadmin':
          return 'bg-primary/10 text-primary font-medium';
        default:
          return 'bg-primary/10 text-primary font-medium';
      }
    }
    
    return '';
  };

  return (
    <div className="hidden md:block w-64 h-screen bg-white border-r fixed top-0 left-0 pt-16 pb-6">
      <div className="flex flex-col h-full overflow-y-auto p-4">
        <div className="space-y-1">
          <Link to="/">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-left font-normal py-2", 
                getActiveClass('/')
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          
          <Link to="/jobs">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-left font-normal py-2", 
                getActiveClass('/jobs')
              )}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Jobs
            </Button>
          </Link>
          
          <Link to="/marketplace">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-left font-normal py-2", 
                getActiveClass('/marketplace')
              )}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Marketplace
            </Button>
          </Link>
          
          <Link to="/messages">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-left font-normal py-2", 
                getActiveClass('/messages')
              )}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
          </Link>
        </div>

        <hr className="my-4" />
        
        {/* Role-specific sections */}
        {(userRole === 'official' || userRole === 'superadmin') && (
          <>
            <Collapsible
              open={openSections['management']}
              onOpenChange={() => toggleSection('management')}
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-left font-normal py-2"
                >
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Management
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    openSections['management'] && "transform rotate-180"
                  )} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                <Link to="/manage-residents">
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-start text-left font-normal py-2", 
                      getActiveClass('/manage-residents')
                    )}
                  >
                    Residents
                  </Button>
                </Link>
                <Link to="/manage-listings">
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-start text-left font-normal py-2", 
                      getActiveClass('/manage-listings')
                    )}
                  >
                    Product Listings
                  </Button>
                </Link>
                <Link to="/manage-jobs">
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-start text-left font-normal py-2", 
                      getActiveClass('/manage-jobs')
                    )}
                  >
                    Job Listings
                  </Button>
                </Link>
              </CollapsibleContent>
            </Collapsible>
          </>
        )}

        {userRole === 'superadmin' && (
          <Link to="/admin">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-left font-normal py-2", 
                getActiveClass('/admin')
              )}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
        )}

        <hr className="my-4" />
        
        {/* Common pages */}
        <Collapsible
          open={openSections['about']}
          onOpenChange={() => toggleSection('about')}
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between text-left font-normal py-2"
            >
              <div className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                About
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                openSections['about'] && "transform rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 space-y-1">
            <Link to="/about">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-left font-normal py-2", 
                  getActiveClass('/about')
                )}
              >
                About Us
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-left font-normal py-2", 
                  getActiveClass('/contact')
                )}
              >
                Contact Us
              </Button>
            </Link>
          </CollapsibleContent>
        </Collapsible>
        
        <Collapsible
          open={openSections['legal']}
          onOpenChange={() => toggleSection('legal')}
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between text-left font-normal py-2"
            >
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Legal
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                openSections['legal'] && "transform rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 space-y-1">
            <Link to="/privacy">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-left font-normal py-2", 
                  getActiveClass('/privacy')
                )}
              >
                Privacy Policy
              </Button>
            </Link>
            <Link to="/terms">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-left font-normal py-2", 
                  getActiveClass('/terms')
                )}
              >
                Terms & Conditions
              </Button>
            </Link>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="mt-auto pt-6">
          <Link to="/settings">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-left font-normal py-2", 
                getActiveClass('/settings')
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
