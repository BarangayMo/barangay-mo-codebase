
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
  Puzzle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react";

export const DesktopSidebar = () => {
  const { pathname } = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const mainMenuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin"
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
      title: "Smarketplace",
      icon: ShoppingBag,
      path: "/admin/smarketplace",
      submenu: [
        {
          title: "Product Management",
          icon: ShoppingBag,
          path: "/admin/smarketplace/products",
          submenu: [
            { title: "All Products", path: "/admin/smarketplace/products/all" },
            { title: "Categories", path: "/admin/smarketplace/products/categories" },
            { title: "Variants", path: "/admin/smarketplace/products/variants" },
            { title: "Slideshow & Media", path: "/admin/smarketplace/products/media" },
            { title: "Reviews & Ratings", path: "/admin/smarketplace/products/reviews" },
            { title: "Bulk Upload", path: "/admin/smarketplace/products/bulk-upload" },
            { title: "Product Settings", path: "/admin/smarketplace/products/settings" },
          ]
        },
        {
          title: "Orders Management",
          icon: Package,
          path: "/admin/smarketplace/orders",
          submenu: [
            { title: "All Orders", path: "/admin/smarketplace/orders/all" },
            { title: "Order Details", path: "/admin/smarketplace/orders/details" },
            { title: "Order Statuses", path: "/admin/smarketplace/orders/statuses" },
            { title: "Invoices & Packing", path: "/admin/smarketplace/orders/invoices" },
            { title: "Abandoned Carts", path: "/admin/smarketplace/orders/abandoned" },
          ]
        },
        {
          title: "Vendor Management",
          icon: Users,
          path: "/admin/smarketplace/vendors",
          submenu: [
            { title: "Vendor Directory", path: "/admin/smarketplace/vendors/directory" },
            { title: "Vendor Products", path: "/admin/smarketplace/vendors/products" },
            { title: "Payouts & Settlements", path: "/admin/smarketplace/vendors/payouts" },
            { title: "Commission Setup", path: "/admin/smarketplace/vendors/commission" },
            { title: "Vendor Applications", path: "/admin/smarketplace/vendors/applications" },
          ]
        },
        {
          title: "Customer Management",
          icon: User,
          path: "/admin/smarketplace/customers",
          submenu: [
            { title: "All Customers", path: "/admin/smarketplace/customers/all" },
            { title: "Purchase History", path: "/admin/smarketplace/customers/history" },
            { title: "Wishlist & Saved Items", path: "/admin/smarketplace/customers/wishlist" },
            { title: "Messages & Support", path: "/admin/smarketplace/customers/messages" },
            { title: "Loyalty Points", path: "/admin/smarketplace/customers/loyalty" },
          ]
        },
        {
          title: "Shipping & Fulfillment",
          icon: Truck,
          path: "/admin/smarketplace/shipping",
          submenu: [
            { title: "Shipping Zones", path: "/admin/smarketplace/shipping/zones" },
            { title: "Vendor-Specific Shipping", path: "/admin/smarketplace/shipping/vendor-specific" },
            { title: "Delivery Windows", path: "/admin/smarketplace/shipping/delivery-windows" },
            { title: "Pickup Stations", path: "/admin/smarketplace/shipping/pickup-stations" },
          ]
        },
        {
          title: "Promotions & Rewards",
          icon: Gift,
          path: "/admin/smarketplace/promotions",
          submenu: [
            { title: "Discount Codes", path: "/admin/smarketplace/promotions/discount-codes" },
            { title: "Gift Cards", path: "/admin/smarketplace/promotions/gift-cards" },
            { title: "Vendor Promotions", path: "/admin/smarketplace/promotions/vendor" },
            { title: "Loyalty & Rewards", path: "/admin/smarketplace/promotions/loyalty" },
          ]
        },
        {
          title: "Financials & Reports",
          icon: ChartBar,
          path: "/admin/smarketplace/financials",
          submenu: [
            { title: "Sales Reports", path: "/admin/smarketplace/financials/sales" },
            { title: "Platform Revenue", path: "/admin/smarketplace/financials/revenue" },
            { title: "Refunds & Adjustments", path: "/admin/smarketplace/financials/refunds" },
            { title: "Tax Settings", path: "/admin/smarketplace/financials/tax" },
          ]
        },
        {
          title: "Reviews & Moderation",
          icon: Star,
          path: "/admin/smarketplace/reviews",
          submenu: [
            { title: "Product Reviews", path: "/admin/smarketplace/reviews/products" },
            { title: "Vendor Reviews", path: "/admin/smarketplace/reviews/vendors" },
            { title: "Dispute Feedback", path: "/admin/smarketplace/reviews/disputes" },
          ]
        },
        {
          title: "System Settings",
          icon: Cog,
          path: "/admin/smarketplace/settings",
          submenu: [
            { title: "Payment Gateways", path: "/admin/smarketplace/settings/payment" },
            { title: "Roles & Permissions", path: "/admin/smarketplace/settings/roles" },
            { title: "Language & Currency", path: "/admin/smarketplace/settings/language" },
            { title: "Legal & Compliance", path: "/admin/smarketplace/settings/legal" },
          ]
        },
        {
          title: "Optional Add-Ons",
          icon: Puzzle,
          path: "/admin/smarketplace/addons",
          submenu: [
            { title: "Returns Center", path: "/admin/smarketplace/addons/returns" },
            { title: "Dispute Resolution", path: "/admin/smarketplace/addons/disputes" },
            { title: "In-app Messaging", path: "/admin/smarketplace/addons/messaging" },
            { title: "Product Approval Queue", path: "/admin/smarketplace/addons/approval" },
            { title: "Vendor Subscriptions", path: "/admin/smarketplace/addons/subscriptions" },
            { title: "Blog/CMS Articles", path: "/admin/smarketplace/addons/blog" },
            { title: "Notifications System", path: "/admin/smarketplace/addons/notifications" },
            { title: "Vendor Performance", path: "/admin/smarketplace/addons/performance" },
            { title: "Custom Form Builder", path: "/admin/smarketplace/addons/forms" },
          ]
        },
      ]
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings"
    }
  ];

  const renderNestedMenu = (items, level = 0, parentPath = '') => {
    return items.map((item) => {
      const isActive = isActive(item.path);
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const sectionId = item.path;
      const isOpen = openSections[sectionId] || false;
      
      return (
        <div key={item.path} className={cn("w-full", level > 0 ? "pl-4" : "")}>
          {hasSubmenu ? (
            <Collapsible
              open={isOpen}
              onOpenChange={() => toggleSection(sectionId)}
              className="w-full"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-2 pr-2 pb-2 border-l-2 border-gray-200 ml-2 mt-1">
                  {renderNestedMenu(item.submenu, level + 1, item.path)}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-3 p-2 text-sm rounded-lg",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100"
              )}
            >
              {level > 0 && <span className="text-gray-400">↳</span>}
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.title}</span>
            </Link>
          )}
        </div>
      );
    });
  };

  const isActive = (path: string) => 
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="hidden md:block w-64 min-h-screen bg-white border-r fixed top-0 left-0 pt-16 pb-6">
      <div className="flex flex-col h-full">
        <div className="flex-1 px-3 py-2 overflow-y-auto">
          <div className="space-y-1">
            {mainMenuItems.map((item) => {
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const sectionId = item.path;
              const isOpen = openSections[sectionId] || false;
              
              return (
                <div key={item.path} className="w-full">
                  {hasSubmenu ? (
                    <Collapsible
                      open={isOpen}
                      onOpenChange={() => toggleSection(sectionId)}
                      className="w-full"
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100 rounded-lg">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="pl-2 pr-2 pb-2">
                          {item.submenu && renderNestedMenu(item.submenu, 1, item.path)}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 p-2 text-sm rounded-lg",
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
