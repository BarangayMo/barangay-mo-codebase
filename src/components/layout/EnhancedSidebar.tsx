
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  CreditCard,
  Store,
  Home,
  LogOut,
  BarChart,
  ChevronRight,
  PieChart,
  UserCog,
  FileType2,
  ClipboardList,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface MenuItemType {
  title: string;
  icon: any;
  path: string;
  submenu?: MenuItemType[];
}

export const EnhancedSidebar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // Try to load from local storage
    const savedState = localStorage.getItem("sidebar-state");
    return savedState ? JSON.parse(savedState) : {};
  });
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const savedCollapsed = localStorage.getItem("sidebar-collapsed");
    return savedCollapsed ? JSON.parse(savedCollapsed) : false;
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

    // Create a copy of openSections
    const newOpenSections = { ...openSections };

    // Close all sections first (to ensure only one is open)
    Object.keys(newOpenSections).forEach(sectionId => {
      newOpenSections[sectionId] = false;
    });

    // Now open the section matching the current path
    mainMenuItems.forEach(item => {
      if (parentPaths.includes(item.path)) {
        newOpenSections[item.path] = true;
      }

      // Check submenu
      if (item.submenu) {
        item.submenu.forEach(subItem => {
          if (parentPaths.includes(subItem.path)) {
            newOpenSections[item.path] = true;
          }

          // Check deeper submenus
          if (subItem.submenu) {
            subItem.submenu.forEach(deepSubItem => {
              if (parentPaths.includes(deepSubItem.path)) {
                newOpenSections[item.path] = true;
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

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleSection = (sectionId: string) => {
    // Create a new state object
    const newOpenSections = { ...openSections };
    
    // Close all sections first
    Object.keys(newOpenSections).forEach(key => {
      newOpenSections[key] = false;
    });
    
    // Then toggle the selected section
    newOpenSections[sectionId] = !openSections[sectionId];
    
    setOpenSections(newOpenSections);
    
    // Scroll to the section
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isActive = (path: string) => 
    pathname === path || pathname.startsWith(`${path}/`);

  const renderNestedMenu = (items: MenuItemType[], level = 0, parentPath = '') => {
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
                <div className="flex items-center gap-3 w-full justify-start">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {!collapsed && <span className={cn("transition-opacity duration-200", isItemActive && "font-medium")}>{item.title}</span>}
                </div>
                {!collapsed && (
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "transform rotate-180"
                  )} />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                {!collapsed && (
                  <div className={cn(
                    "pl-4 border-l-2 border-gray-200 ml-2 mt-1",
                    level > 0 ? "ml-3" : "ml-2"
                  )}>
                    {renderNestedMenu(item.submenu || [], level + 1, item.path)}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-3 p-2 text-sm rounded-lg transition-colors w-full justify-start",
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
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )}
        </div>
      );
    });
  };

  const mainMenuItems: MenuItemType[] = [
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
          icon: PieChart,
          path: "/admin/smarketplace/overview"
        },
        {
          title: "Product Management",
          icon: ShoppingBag,
          path: "/admin/smarketplace/products",
          submenu: [
            { title: "All Products", path: "/admin/smarketplace/products/all", icon: Package },
            { title: "Categories", path: "/admin/smarketplace/products/categories", icon: ChartBar },
            { title: "Inventory", path: "/admin/smarketplace/products/inventory", icon: ClipboardList }
          ]
        },
        {
          title: "Orders Management",
          icon: Package,
          path: "/admin/smarketplace/orders",
          submenu: [
            { title: "All Orders", path: "/admin/smarketplace/orders/all", icon: ClipboardList },
            { title: "Processing", path: "/admin/smarketplace/orders/processing", icon: Truck },
            { title: "Completed", path: "/admin/smarketplace/orders/completed", icon: FileType2 }
          ]
        },
        {
          title: "Vendor Management",
          icon: Users,
          path: "/admin/smarketplace/vendors",
          submenu: [
            { title: "All Vendors", path: "/admin/smarketplace/vendors/all", icon: Users },
            { title: "Applications", path: "/admin/smarketplace/vendors/applications", icon: FileText }
          ]
        },
        {
          title: "Customer Management",
          icon: User,
          path: "/admin/smarketplace/customers",
          submenu: [
            { title: "All Customers", path: "/admin/smarketplace/customers/all", icon: Users },
            { title: "VIP Customers", path: "/admin/smarketplace/customers/vip", icon: Gift }
          ]
        },
        {
          title: "Payouts",
          icon: CreditCard,
          path: "/admin/smarketplace/payouts",
          submenu: [
            { title: "All Payouts", path: "/admin/smarketplace/payouts/all", icon: CreditCard },
            { title: "Vendor Payouts", path: "/admin/smarketplace/payouts/vendors", icon: CreditCard }
          ]
        }
      ]
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/admin/reports",
      submenu: [
        { title: "Financial Reports", path: "/admin/reports/financial", icon: BarChart },
        { title: "Activity Logs", path: "/admin/reports/activity", icon: FileText },
      ]
    },
    {
      title: "User Management",
      icon: Users,
      path: "/admin/users",
      submenu: [
        { title: "Residents", path: "/admin/users/residents", icon: User },
        { title: "Officials", path: "/admin/users/officials", icon: UserCog },
      ]
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings"
    }
  ];

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 bottom-0 bg-white border-r transition-all duration-300 z-30 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between p-4 border-b">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/d6bf0909-f59b-42dc-8d79-b45a400a1081.png" 
            alt="Logo" 
            className="h-8 w-8" 
          />
          {!collapsed && <span className="font-bold text-lg">Admin Panel</span>}
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Menu sections */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {mainMenuItems.map((section, index) => {
          // Group separation
          const isNewGroup = index === 0 || index === 1 || index === 3;
          
          return (
            <div key={section.path} id={section.path} className={cn(isNewGroup && index > 0 && "pt-4")}>
              {/* Group separator */}
              {isNewGroup && index > 0 && (
                <div className="px-3 mb-2">
                  {!collapsed && <Separator className="mb-2" />}
                  {!collapsed && (
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {index === 1 ? "Marketplace" : index === 3 ? "Administration" : ""}
                    </p>
                  )}
                </div>
              )}
              
              {/* Render section and its subitems */}
              {renderNestedMenu([section])}
            </div>
          );
        })}
      </div>
      
      {/* User profile section */}
      <div className="mt-auto border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex items-center w-full rounded-lg p-2 hover:bg-gray-100 transition-colors",
              collapsed ? "justify-center" : "justify-between"
            )}>
              <div className={cn(
                "flex items-center gap-2",
                collapsed ? "justify-center" : ""
              )}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="text-left">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">Super Admin</p>
                  </div>
                )}
              </div>
              {!collapsed && <ChevronDown className="h-4 w-4" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <Link to="/admin/settings/profile">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/admin/settings">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
