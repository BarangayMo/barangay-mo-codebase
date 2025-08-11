
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems: Array<{
    label: string;
    href?: string;
  }>;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "dashboard" | "destructive" | "outline" | "secondary" | "ghost";
    disabled?: boolean;
  };
  secondaryActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "dashboard" | "destructive" | "outline" | "secondary" | "ghost";
    disabled?: boolean;
  }>;
  className?: string;
}

export function DashboardPageHeader({
  title,
  description,
  breadcrumbItems,
  actionButton,
  secondaryActions,
  className,
}: PageHeaderProps) {
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
    <div className={cn("space-y-4 py-6 md:py-8", className)}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={getHomeRoute()}>
              {getHomeBreadcrumbLabel()}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {breadcrumbItems.map((crumb, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            return (
              <BreadcrumbItem key={crumb.label}>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && <p className="mt-2 text-gray-500">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {secondaryActions && secondaryActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                action.variant === "dashboard"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : action.variant === "outline"
                  ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-gray-900 text-white hover:bg-gray-800",
                action.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              disabled={actionButton.disabled}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                actionButton.variant === "dashboard"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : actionButton.variant === "outline"
                  ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-gray-900 text-white hover:bg-gray-800",
                actionButton.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {actionButton.icon}
              {actionButton.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
