
import { ReactNode, useState } from "react";
import { Helmet } from "react-helmet";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { ModernTabs, TabItem } from "@/components/dashboard/ModernTabs";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface PageTemplateProps {
  title: string;
  description?: string;
  children?: ReactNode;
  hasTabs?: boolean;
  tabItems?: TabItem[];
  actionButton?: {
    label: string;
    onClick: () => void;
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
  
  return (
    <div className="container py-6">
      <Helmet>
        <title>{title} - Smarketplace Admin</title>
      </Helmet>
      
      <DashboardPageHeader
        title={title}
        description={description}
        breadcrumbItems={breadcrumbItems.length > 0 ? breadcrumbItems : [{ label: title }]}
        action={actionButton && (
          <Button onClick={actionButton.onClick}>{actionButton.label}</Button>
        )}
      />
      
      {hasTabs && tabItems && tabItems.length > 0 ? (
        <ModernTabs defaultValue={defaultTabValue} items={tabItems}>
          {tabItems.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              {children}
            </TabsContent>
          ))}
        </ModernTabs>
      ) : (
        children
      )}
    </div>
  );
};

export default PageTemplate;
