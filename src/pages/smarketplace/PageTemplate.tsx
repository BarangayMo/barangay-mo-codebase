
import { ReactNode } from "react";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { ModernTabs, TabItem } from "@/components/dashboard/ModernTabs";
import { TabsContent } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PlusCircle, Plus } from "lucide-react";

interface PageTemplateProps {
  title: string;
  description?: string;
  children?: ReactNode;
  hasTabs?: boolean;
  tabItems?: TabItem[];
  actionButton?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "dashboard" | "destructive" | "outline" | "secondary" | "ghost";
    icon?: ReactNode;
    disabled?: boolean;
  };
  breadcrumbItems?: {
    label: string;
    href?: string;
  }[];
}

const PageTemplate = ({
  title,
  description,
  children,
  hasTabs = false,
  tabItems = [],
  actionButton,
  breadcrumbItems = []
}: PageTemplateProps) => {
  const defaultTabValue = tabItems.length > 0 ? tabItems[0].value : "";
  
  // Default action button for "Add" actions
  const defaultActionButton = title.toLowerCase().includes("product") ? {
    label: "Add Product",
    onClick: () => console.log("Add product clicked"),
    icon: <PlusCircle className="h-4 w-4" />
  } : title.toLowerCase().includes("vendor") ? {
    label: "Add Vendor",
    onClick: () => console.log("Add vendor clicked"),
    icon: <Plus className="h-4 w-4" />
  } : null;
  
  const finalActionButton = actionButton || defaultActionButton;

  return (
    <AdminLayout title={title}>
      <DashboardPageHeader
        title={title}
        description={description}
        breadcrumbItems={breadcrumbItems.length > 0 ? breadcrumbItems : [{ label: title }]}
        actionButton={finalActionButton}
      />
      
      {hasTabs && tabItems && tabItems.length > 0 ? (
        <ModernTabs defaultValue={defaultTabValue} items={tabItems}>
          {tabItems.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0 animate-fade-in">
              {tab.value === defaultTabValue && children}
            </TabsContent>
          ))}
        </ModernTabs>
      ) : (
        <div className="animate-fade-in">{children}</div>
      )}
    </AdminLayout>
  );
};

export default PageTemplate;
