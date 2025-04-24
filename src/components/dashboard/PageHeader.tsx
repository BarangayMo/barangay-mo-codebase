
import { ReactNode } from "react";
import { DashboardBreadcrumb } from "./Breadcrumb";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems: {
    label: string;
    href?: string;
  }[];
  action?: ReactNode;
}

export function DashboardPageHeader({
  title,
  description,
  breadcrumbItems,
  action
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
      </div>
    </div>
  );
}
