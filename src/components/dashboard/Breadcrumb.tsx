
import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useAuth } from "@/contexts/AuthContext";

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
  className?: string;
}

export function DashboardBreadcrumb({ items, className }: BreadcrumbProps) {
  const { userRole } = useAuth();

  const getHomeRoute = () => {
    switch (userRole) {
      case "resident":
        return "/resident-home";
      case "official":
        return "/official-dashboard";
      case "superadmin":
        return "/admin";
      default:
        return "/";
    }
  };

  const getHomeBreadcrumbLabel = () => {
    switch (userRole) {
      case "resident":
        return "Home";
      case "official":
        return "Dashboard";
      case "superadmin":
        return "Dashboard";
      default:
        return "Home";
    }
  };

  return (
    <Breadcrumb className={className || "mb-6"}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={getHomeRoute()} className="flex items-center hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5 mr-1" />
              <span>{getHomeBreadcrumbLabel()}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {index === items.length - 1 ? (
                <BreadcrumbPage className="font-medium">{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.href || "#"} className="hover:text-primary transition-colors">{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
