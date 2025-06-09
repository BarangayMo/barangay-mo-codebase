
import { Home, ShoppingBag, Package, User, Users, FileText, Settings, BarChart, Store, MessageSquare, Image, Library, Briefcase } from "lucide-react";

export const sidebarMenuItems = [
  {
    groupLabel: "General",
    items: [
      {
        title: "Dashboard",
        icon: Home,
        path: "/admin"
      },
    ]
  },
  {
    groupLabel: "Marketplace",
    items: [
      {
        title: "Smarketplace",
        icon: Store,
        path: "/admin/smarketplace",
        submenu: [
          {
            title: "Overview",
            icon: BarChart,
            path: "/admin/smarketplace/overview",
          },
          {
            title: "Products",
            icon: ShoppingBag,
            path: "/admin/smarketplace/products",
            submenu: [
              { title: "All Products", path: "/admin/smarketplace/products/all" },
              { title: "Categories", path: "/admin/smarketplace/products/categories" },
              { title: "Inventory", path: "/admin/smarketplace/products/inventory" }
            ]
          },
          {
            title: "Orders",
            icon: Package,
            path: "/admin/smarketplace/orders",
            submenu: [
              { title: "All Orders", path: "/admin/smarketplace/orders/all" },
              { title: "Processing", path: "/admin/smarketplace/orders/processing" },
              { title: "Completed", path: "/admin/smarketplace/orders/completed" }
            ]
          },
          {
            title: "Vendors",
            icon: Users,
            path: "/admin/smarketplace/vendors",
            submenu: [
              { title: "Directory", path: "/admin/smarketplace/vendors/all" },
              { title: "Applications", path: "/admin/smarketplace/vendors/applications" }
            ]
          },
          {
            title: "Customers",
            icon: User,
            path: "/admin/smarketplace/customers",
            submenu: [
              { title: "Directory", path: "/admin/smarketplace/customers/all" },
              { title: "VIP", path: "/admin/smarketplace/customers/vip" }
            ]
          }
        ]
      }
    ]
  },
  {
    groupLabel: "Communication",
    items: [
      {
        title: "Messaging",
        icon: MessageSquare,
        path: "/admin/messages",
      }
    ]
  },
  {
    groupLabel: "Data",
    items: [
      {
        title: "Reports",
        icon: FileText,
        path: "/admin/reports",
        submenu: [
          { title: "Financial", path: "/admin/reports/financial" },
          { title: "Activity", path: "/admin/reports/activity" },
        ]
      },
      {
        title: "Users",
        icon: Users,
        path: "/admin/users",
        submenu: [
          { title: "All Users", path: "/admin/users/all" },
          { title: "User Roles", path: "/admin/users/roles" },
          { title: "Settings", path: "/admin/users/settings" },
        ]
      },
      {
        title: "Jobs",
        icon: Briefcase,
        path: "/admin/jobs",
        submenu: [
          { title: "All Jobs", path: "/admin/jobs/all" },
          { title: "Applications", path: "/admin/jobs/applications" },
        ]
      },
      {
        title: "Media Library",
        icon: Library,
        path: "/admin/media-library"
      },
    ]
  },
  {
    groupLabel: "System",
    items: [
      {
        title: "Settings",
        icon: Settings,
        path: "/admin/settings"
      }
    ]
  }
];
