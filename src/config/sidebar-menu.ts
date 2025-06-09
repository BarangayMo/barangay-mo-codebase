import {
  BarChart,
  Users,
  Package,
  ShoppingBag,
  User,
  Truck,
  Gift,
  ChartBar,
  Star,
  Cog,
  Puzzle,
  FileText,
  CreditCard,
  MessageSquare,
  Settings,
  ShieldCheck,
} from "lucide-react";

export const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: BarChart,
    roles: ["superadmin", "admin"],
  },
  {
    label: "Users",
    icon: Users,
    roles: ["superadmin", "admin"],
    children: [
      {
        label: "All Users",
        href: "/admin/users/all",
        icon: Users,
        roles: ["superadmin", "admin"],
      },
      {
        label: "User Roles", 
        href: "/admin/users/roles",
        icon: ShieldCheck,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Settings",
        href: "/admin/users/settings", 
        icon: Settings,
        roles: ["superadmin", "admin"],
      }
    ]
  },
  {
    label: "Smarketplace",
    icon: ShoppingBag,
    roles: ["superadmin", "admin"],
    children: [
      {
        label: "Overview",
        href: "/admin/smarketplace",
        icon: BarChart,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Products",
        href: "/admin/smarketplace/products",
        icon: Package,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Orders",
        href: "/admin/smarketplace/orders",
        icon: ShoppingBag,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Vendors",
        href: "/admin/smarketplace/vendors",
        icon: Users,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Customers",
        href: "/admin/smarketplace/customers",
        icon: User,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Shipping",
        href: "/admin/smarketplace/shipping",
        icon: Truck,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Promotions",
        href: "/admin/smarketplace/promotions",
        icon: Gift,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Financials",
        href: "/admin/smarketplace/financials",
        icon: ChartBar,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Reviews",
        href: "/admin/smarketplace/reviews",
        icon: Star,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Settings",
        href: "/admin/smarketplace/settings",
        icon: Settings,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Add-ons",
        href: "/admin/smarketplace/addons",
        icon: Puzzle,
        roles: ["superadmin", "admin"],
      },
    ]
  },
  {
    label: "Reports",
    icon: FileText,
    roles: ["superadmin", "admin"],
    children: [
      {
        label: "Activity Logs",
        href: "/admin/reports/activity-logs",
        icon: FileText,
        roles: ["superadmin", "admin"],
      },
      {
        label: "Financial Reports",
        href: "/admin/reports/financial-reports",
        icon: CreditCard,
        roles: ["superadmin", "admin"],
      },
    ]
  },
  {
    label: "Media Library",
    href: "/admin/media-library",
    icon: FileText,
    roles: ["superadmin", "admin"],
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
    roles: ["superadmin", "admin"],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["superadmin", "admin"],
  },
];
