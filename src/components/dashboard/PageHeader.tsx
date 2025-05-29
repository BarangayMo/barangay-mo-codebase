import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DashboardBreadcrumb } from "./Breadcrumb";
interface BreadcrumbItem {
  label: string;
  href?: string;
}
interface ActionButton {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "dashboard";
}
interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems?: BreadcrumbItem[];
  actionButton?: ActionButton;
  secondaryActions?: ActionButton[];
}
export function DashboardPageHeader({
  title,
  description,
  breadcrumbItems,
  actionButton,
  secondaryActions = []
}: DashboardPageHeaderProps) {
  return <div className="mb-8">
      {breadcrumbItems && <DashboardBreadcrumb items={breadcrumbItems} />}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {secondaryActions.map((action, index) => <Button key={index} variant={action.variant || "outline"} onClick={action.onClick} className="flex items-center gap-2">
              {action.icon}
              {action.label}
            </Button>)}
          {actionButton && <Button variant={actionButton.variant || "default"} onClick={actionButton.onClick} className="flex items-center gap-2 text-slate-50 bg-blue-600 hover:bg-blue-500">
              {actionButton.icon}
              {actionButton.label}
            </Button>}
        </div>
      </div>
    </div>;
}