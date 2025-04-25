
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronDown,
  ShoppingBag,
  Package,
  User,
  CreditCard,
  Puzzle,
  Store,
  BarChart as BarChartIcon,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

interface EnhancedSidebarProps {
  isCollapsed?: boolean;
}

export const EnhancedSidebar = ({ isCollapsed = false }: EnhancedSidebarProps) => {
  const { pathname } = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // Try to load from local storage
    const savedState = localStorage.getItem("sidebar-state");
    return savedState ? JSON.parse(savedState) : {};
  });

  // Find all parent paths of the current pathname
  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Build all possible parent paths
    const parentPaths: string[] = [];
    for (let i = 1; i <= pathSegments.length; i++) {
      const path = `/${pathSegments.slice(0, i).join('/')}`;
      parentPaths.push(path);
    }

    // Auto-expand relevant menu sections based on current path
    const newOpenSections = { ...openSections };
    
    mainMenuItems.forEach(item => {
      if (parentPaths.includes(item.path)) {
        newOpenSections[item.path] = true;
      }

      // Check submenu
      if (item.submenu) {
        item.submenu.forEach(subItem => {
          if (parentPaths.includes(subItem.path)) {
            newOpenSections[item.path] = true;
            
            // If sub-item has its own submenu
            if (subItem.submenu) {
              newOpenSections[subItem.path] = true;
            }
          }

          // Check deeper submenus
          if (subItem.submenu) {
            subItem.submenu.forEach(deepSubItem => {
              if (parentPaths.includes(deepSubItem.path)) {
                newOpenSections[item.path] = true;
                newOpenSections[subItem.path] = true;
              }
            });
          }
        });
      }
    });

    setOpenSections(newOpenSections);
    
  }, [pathname]);

  // Save to localStorage when openSections changes
  useEffect(() => {
    localStorage.setItem("sidebar-state", JSON.stringify(openSections));
  }, [openSections]);

  const toggleSection = (sectionId: string, event: React.MouseEvent) => {
    // Prevent event from bubbling up to parent elements
    event.stopPropagation();
    
    setOpenSections(prev => {
      const newState = { ...prev };
      newState[sectionId] = !prev[sectionId];
      return newState;
    });
  };

  const isActive = (path: string) => 
    pathname === path || pathname.startsWith(`${path}/`);

  const renderNestedMenu = (items: any[], level = 0, parentPath = '') => {
    return items.map((item) => {
      const isItemActive = isActive(item.path);
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const sectionId = item.path;
      const isOpen = openSections[sectionId] || false;
      
      return (
        <div key={item.path} className={cn("w-full", level > 0 ? "mb-1" : "mb-1")}>
          {hasSubmenu ? (
            <Collapsible
              open={isOpen}
              onOpenChange={() => {}} // We'll handle this manually with our toggleSection
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={(e) => toggleSection(sectionId, e)}
                  className={cn(
                    "flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100 rounded-lg transition-all",
                    isItemActive && "bg-blue-50 text-blue-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {!isCollapsed && <span className={cn(isItemActive && "font-medium")}>{item.title}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isOpen && "transform rotate-180"
                    )} />
                  )}
                </Button>
              </CollapsibleTrigger>
              {!isCollapsed && (
                <CollapsibleContent className="animate-accordion-down transition-all duration-300">
                  <div className={cn(
                    "pl-4 border-l-2 border-gray-200 ml-2 mt-1",
                    level > 0 ? "ml-3" : "ml-2"
                  )}>
                    {renderNestedMenu(item.submenu, level + 1, item.path)}
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          ) : (
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-3 p-2 text-sm rounded-lg transition-colors",
                isItemActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-gray-100",
                isCollapsed && "justify-center"
              )}
            >
              {level > 0 && !isCollapsed ? (
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                </div>
              ) : (
                item.icon && <item.icon className="h-4 w-4" />
              )}
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          )}
        </div>
      );
    });
  };

  const mainMenuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin"
    },
    {
      title: "Smarketplace",
      icon: Store,
      path: "/admin/smarketplace",
      submenu: [
        {
          title: "Overview",
          icon: BarChartIcon,
          path: "/admin/smarketplace/overview",
        },
        {
          title: "Product Management",
          icon: ShoppingBag,
          path: "/admin/smarketplace/products",
          submenu: [
            { title: "All Products", path: "/admin/smarketplace/products/all" },
            { title: "Categories", path: "/admin/smarketplace/products/categories" },
            { title: "Inventory", path: "/admin/smarketplace/products/inventory" }
          ]
        },
        {
          title: "Orders Management",
          icon: Package,
          path: "/admin/smarketplace/orders",
          submenu: [
            { title: "All Orders", path: "/admin/smarketplace/orders/all" },
            { title: "Processing", path: "/admin/smarketplace/orders/processing" },
            { title: "Completed", path: "/admin/smarketplace/orders/completed" }
          ]
        },
        {
          title: "Vendor Management",
          icon: Users,
          path: "/admin/smarketplace/vendors",
          submenu: [
            { title: "All Vendors", path: "/admin/smarketplace/vendors/all" },
            { title: "Applications", path: "/admin/smarketplace/vendors/applications" }
          ]
        },
        {
          title: "Customer Management",
          icon: User,
          path: "/admin/smarketplace/customers",
          submenu: [
            { title: "All Customers", path: "/admin/smarketplace/customers/all" },
            { title: "VIP Customers", path: "/admin/smarketplace/customers/vip" }
          ]
        },
        {
          title: "Payouts",
          icon: CreditCard,
          path: "/admin/smarketplace/payouts",
          submenu: [
            { title: "All Payouts", path: "/admin/smarketplace/payouts/all" },
            { title: "Vendor Payouts", path: "/admin/smarketplace/payouts/vendors" }
          ]
        }
      ]
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/admin/reports",
      submenu: [
        { title: "Financial Reports", path: "/admin/reports/financial" },
        { title: "Activity Logs", path: "/admin/reports/activity" },
      ]
    },
    {
      title: "User Management",
      icon: Users,
      path: "/admin/users",
      submenu: [
        { title: "Residents", path: "/admin/users/residents" },
        { title: "Officials", path: "/admin/users/officials" },
      ]
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings"
    }
  ];

  const renderSectionGroups = () => {
    const sectionGroups = [
      { title: "Main Navigation", items: [mainMenuItems[0]] },
      { title: "Marketplace", items: [mainMenuItems[1]] },
      { title: "Administration", items: mainMenuItems.slice(2) }
    ];

    return sectionGroups.map((group, index) => (
      <div key={group.title} className="mt-4">
        {!isCollapsed && (
          <div className="px-4 py-2">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">{group.title}</h3>
          </div>
        )}
        <div className="space-y-1 px-3">
          {renderNestedMenu(group.items)}
        </div>
        {index < sectionGroups.length - 1 && !isCollapsed && (
          <Separator className="my-4 mx-3" />
        )}
      </div>
    ));
  };

  return (
    <div className="px-3 py-2 h-full overflow-y-auto">
      {renderSectionGroups()}
    </div>
  );
};
