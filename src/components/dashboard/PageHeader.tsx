
import { ReactNode } from "react";
import { DashboardBreadcrumb } from "./Breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems: {
    label: string;
    href?: string;
  }[];
  action?: ReactNode;
  actionButton?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
    icon?: React.ReactNode;
  };
}

export function DashboardPageHeader({
  title,
  description,
  breadcrumbItems,
  action,
  actionButton
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <DashboardBreadcrumb items={breadcrumbItems} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
        {actionButton && (
          <Button 
            onClick={actionButton.onClick}
            variant={actionButton.variant || "default"}
            className={cn(
              "transition-all",
              actionButton.variant === "destructive" ? "hover:bg-red-700" : "",
              !actionButton.variant || actionButton.variant === "default" ? "hover:bg-primary/90" : ""
            )}
          >
            {actionButton.icon && <span className="mr-2">{actionButton.icon}</span>}
            {actionButton.label}
          </Button>
        )}
      </div>
    </div>
  );
}
