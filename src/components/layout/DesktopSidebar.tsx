
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
  Truck,
  Gift,
  ChartBar,
  Star,
  Cog,
  Puzzle,
  Home,
  Store,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

export const DesktopSidebar = () => {
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

    // Check if any parent paths match our menu items
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
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Save to localStorage when openSections changes
  useEffect(() => {
    localStorage.setItem("sidebar-state", JSON.stringify(openSections));
  }, [openSections]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const isActive = (path: string) => 
    pathname === path || pathname.startsWith(`${path}/`);

  const renderNestedMenu = (items, level = 0, parentPath = '') => {
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
              onOpenChange={() => toggleSection(sectionId)}
              className="w-full"
            >
              <CollapsibleTrigger className={cn(
                "flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100 rounded-lg transition-all",
                isItemActive && "bg-blue-50 text-blue-600"
              )}>
                <div className="flex items-center gap-3">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span className={cn(isItemActive && "font-medium")}>{item.title}</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "transform rotate-180"
                )} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className={cn(
                  "pl-4 border-l-2 border-gray-200 ml-2 mt-1",
                  level > 0 ? "ml-3" : "ml-2"
                )}>
                  {renderNestedMenu(item.submenu, level + 1, item.path)}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-3 p-2 text-sm rounded-lg transition-colors",
                isItemActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              )}
            >
              {level > 0 ? (
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                </div>
              ) : (
                item.icon && <item.icon className="h-4 w-4" />
              )}
              <span>{item.title}</span>
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

  return (
    <SidebarProvider>
      <div className="hidden md:block w-64 min-h-screen bg-white border-r fixed top-0 left-0 pt-16 pb-6 z-20">
        <div className="flex flex-col h-full">
          <div className="flex items-center px-4 py-2">
            <Link to="/" className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              <span className="font-semibold">Home</span>
            </Link>
          </div>
          <div className="flex-1 px-3 py-2 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-thin scrollbar-thumb-gray-200">
            <div className="space-y-1">
              {mainMenuItems.map((item) => {
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const sectionId = item.path;
                const isOpen = openSections[sectionId] || false;
                const isItemActive = isActive(item.path);
                
                return (
                  <div key={item.path} className="w-full">
                    {hasSubmenu ? (
                      <Collapsible
                        open={isOpen}
                        onOpenChange={() => toggleSection(sectionId)}
                        className="w-full"
                      >
                        <CollapsibleTrigger className={cn(
                          "flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100 rounded-lg transition-all",
                          isItemActive && !isOpen && "bg-blue-50 text-blue-600"
                        )}>
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform",
                            isOpen && "transform rotate-180"
                          )} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="animate-accordion-down">
                          <div className="pl-3 pr-2 mt-1 space-y-1">
                            {item.submenu && renderNestedMenu(item.submenu, 1, item.path)}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 p-2 text-sm rounded-lg transition-colors",
                          isActive(item.path)
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-100"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="px-3 mt-auto">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Need help?</p>
                  <p className="text-xs text-gray-500">Contact support</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
