
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
    variant?: "default" | "dashboard";
  };
  className?: string;
}

export function DashboardPageHeader({
  title,
  description,
  breadcrumbItems,
  actionButton,
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
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
              actionButton.variant === "dashboard"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-900 text-white hover:bg-gray-800"
            )}
          >
            {actionButton.icon}
            {actionButton.label}
          </button>
        )}
      </div>
    </div>
  );
}
