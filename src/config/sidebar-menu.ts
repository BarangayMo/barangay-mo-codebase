
import { Home, ShoppingBag, Package, User, Users, FileText, Settings, BarChart, Store } from "lucide-react";

export const sidebarMenuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/admin"
  },
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

