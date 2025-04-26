import { useState } from "react";
import { User, Star, Clock, UserX, PlusCircle } from "lucide-react";
import { ModernTabs } from "@/components/dashboard/ModernTabs";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CustomerSearch } from "@/components/smarketplace/customers/CustomerSearch";
import { CustomerViewToggle } from "@/components/smarketplace/customers/CustomerViewToggle";
import { CustomerListView } from "@/components/smarketplace/customers/CustomerListView";
import { CustomerGridView } from "@/components/smarketplace/customers/CustomerGridView";
import PageTemplate from "../PageTemplate";

const CustomersAllPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const tabItems = [
    { icon: <User className="h-4 w-4" />, label: "All", value: "all" },
    { icon: <Star className="h-4 w-4" />, label: "VIP", value: "vip" },
    { icon: <Clock className="h-4 w-4" />, label: "New", value: "new" },
    { icon: <UserX className="h-4 w-4" />, label: "Inactive", value: "inactive" }
  ];

  const customerData = [
    { id: 1, name: "Sofia Lopez", email: "sofia.lopez@email.com", status: "active", orderCount: 12, totalSpent: "₱12,450", lastSeen: "Today" },
    { id: 2, name: "Miguel Santos", email: "miguel.s@email.com", status: "active", orderCount: 8, totalSpent: "₱8,320", lastSeen: "Yesterday" },
    { id: 3, name: "Ana Garcia", email: "ana.garcia@email.com", status: "active", orderCount: 5, totalSpent: "₱6,780", lastSeen: "3 days ago" },
    { id: 4, name: "Juan Cruz", email: "juan.cruz@email.com", status: "inactive", orderCount: 3, totalSpent: "₱2,150", lastSeen: "2 weeks ago" },
    { id: 5, name: "Maria Reyes", email: "maria.r@email.com", status: "active", orderCount: 22, totalSpent: "₱25,980", lastSeen: "Today" },
    { id: 6, name: "Jose Ramos", email: "jose.ramos@email.com", status: "inactive", orderCount: 1, totalSpent: "₱950", lastSeen: "1 month ago" },
    { id: 7, name: "Teresa Lim", email: "teresa.lim@email.com", status: "active", orderCount: 17, totalSpent: "₱18,340", lastSeen: "Yesterday" },
    { id: 8, name: "Carlos Bautista", email: "carlos.b@email.com", status: "active", orderCount: 6, totalSpent: "₱7,210", lastSeen: "4 days ago" }
  ];

  const breadcrumbItems = [
    { label: "Smarketplace", href: "/admin/smarketplace" },
    { label: "Customers" }
  ];

  return (
    <PageTemplate
      title="Customer Management"
      description="View and manage marketplace customers"
      breadcrumbItems={breadcrumbItems}
      actionButton={{
        label: "Add Customer",
        onClick: () => console.log("Add customer clicked"),
        icon: <PlusCircle className="h-4 w-4" />
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Customers"
          value="1,249"
          change={{ value: 8, isPositive: true }}
          icon={<User className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard 
          title="Active Today"
          value="24"
          icon={<Clock className="h-5 w-5 text-green-500" />}
          iconColor="bg-green-50"
        />
        <StatsCard 
          title="VIP Customers"
          value="36"
          change={{ value: 5, isPositive: true }}
          icon={<Star className="h-5 w-5 text-amber-500" />}
          iconColor="bg-amber-50"
        />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <CustomerSearch />
        <CustomerViewToggle 
          viewMode={viewMode} 
          onViewChange={setViewMode}
        />
      </div>
      
      <ModernTabs defaultValue="all" items={tabItems}>
        {viewMode === 'grid' ? (
          <CustomerGridView customers={customerData} />
        ) : (
          <CustomerListView 
            customers={customerData}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
        )}
      </ModernTabs>
    </PageTemplate>
  );
};

export default CustomersAllPage;
