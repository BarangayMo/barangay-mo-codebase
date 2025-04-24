
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export function DashboardBreadcrumb({ items }: BreadcrumbProps) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/admin">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            
            {index === items.length - 1 ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={item.href || "#"}>{item.label}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
