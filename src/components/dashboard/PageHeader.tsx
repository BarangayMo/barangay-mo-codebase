
import { ReactNode } from "react";
import { DashboardBreadcrumb as Breadcrumb } from "./Breadcrumb";
import { Button } from "@/components/ui/button";

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems?: {
    label: string;
    href?: string;
  }[];
  actionButton?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "dashboard";
    icon?: ReactNode;
  };
}

export const DashboardPageHeader = ({
  title,
  description,
  breadcrumbItems = [],
  actionButton,
}: DashboardPageHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && <p className="text-gray-500">{description}</p>}
        </div>
        {actionButton && (
          <Button variant={actionButton.variant} onClick={actionButton.onClick}>
            {actionButton.icon}
            {actionButton.label}
          </Button>
        )}
      </div>
      {breadcrumbItems.length > 0 && (
        <Breadcrumb items={breadcrumbItems} className="mt-2" />
      )}
    </div>
  );
};
