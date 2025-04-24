
import { useState } from "react";
import { User, Star, Clock, UserX, Search, Filter, Grid, List, PlusCircle } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { ModernTabs } from "@/components/dashboard/ModernTabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CustomerCard } from "@/components/dashboard/CustomerCard";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const breadcrumbItems = [
    { label: "Smarketplace", href: "/admin/smarketplace" },
    { label: "Customers" }
  ];

  return (
    <AdminLayout title="All Customers">
      <DashboardPageHeader
        title="Customer Management"
        description="View and manage marketplace customers"
        breadcrumbItems={breadcrumbItems}
        actionButton={{
          label: "Add Customer",
          onClick: () => console.log("Add customer clicked"),
          icon: <PlusCircle className="h-4 w-4" />
        }}
      />

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
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search customers..." className="pl-9" />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
          
          <div className="border rounded-md flex">
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "rounded-none", 
                viewMode === 'grid' && "bg-gray-100"
              )}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "rounded-none",
                viewMode === 'list' && "bg-gray-100"
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <ModernTabs defaultValue="all" items={tabItems}>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
            {customerData.map((customer) => (
              <CustomerCard
                key={customer.id}
                name={customer.name}
                email={customer.email}
                status={customer.status as any}
                orderCount={customer.orderCount}
                totalSpent={customer.totalSpent}
                lastSeen={customer.lastSeen}
              />
            ))}
          </div>
        ) : (
          <Card className="animate-fade-in">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort('name')}>
                      Customer {sortColumn === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                      Email {sortColumn === 'email' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('orderCount')}>
                      Orders {sortColumn === 'orderCount' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('totalSpent')}>
                      Total Spent {sortColumn === 'totalSpent' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('lastSeen')}>
                      Last Seen {sortColumn === 'lastSeen' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.orderCount}</TableCell>
                      <TableCell>{customer.totalSpent}</TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>{customer.lastSeen}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View Profile</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </ModernTabs>
    </AdminLayout>
  );
};

export default CustomersAllPage;
