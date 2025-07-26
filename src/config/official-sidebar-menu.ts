import { 
  Home, 
  Users, 
  Wrench, 
  FileText, 
  MessageSquare, 
  Shield, 
  Calendar, 
  BarChart, 
  Settings,
  AlertTriangle,
  Briefcase,
  Package,
  Store
} from "lucide-react";

export const officialSidebarMenuItems = [
  {
    groupLabel: "Dashboard",
    items: [
      {
        title: "Overview",
        icon: Home,
        path: "/official-dashboard"
      },
    ]
  },
  {
    groupLabel: "Community",
    items: [
      {
        title: "Residents",
        icon: Users,
        path: "/official/residents"
      },
      {
        title: "Community",
        icon: MessageSquare,
        path: "/official/community"
      },
      {
        title: "Services",
        icon: Wrench,
        path: "/official/services"
      },
      {
        title: "Requests",
        icon: FileText,
        path: "/official/requests"
      }
    ]
  },
  {
    groupLabel: "Operations",
    items: [
      {
        title: "Emergency Response",
        icon: AlertTriangle,
        path: "/official/emergency-response"
      },
      {
        title: "Jobs",
        icon: Briefcase,
        path: "/official/jobs"
      },
      {
        title: "Products",
        icon: Package,
        path: "/official/products"
      }
    ]
  },
  {
    groupLabel: "Administrative",
    items: [
      {
        title: "RBI Forms",
        icon: FileText,
        path: "/official/rbi-forms"
      },
      {
        title: "Officials",
        icon: Shield,
        path: "/official/officials"
      }
    ]
  }
];