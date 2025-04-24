
import { useState } from "react";
import { Users, Star, ShoppingBag, Search, Filter, PlusCircle, ArrowUp, BarChart4 } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { ModernTabs } from "@/components/dashboard/ModernTabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { VendorCard } from "@/components/dashboard/VendorCard";
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
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const VendorsAllPage = () => {
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
    { icon: <Users className="h-4 w-4" />, label: "All Vendors", value: "all" },
    { icon: <Star className="h-4 w-4" />, label: "Top Performers", value: "top" },
    { icon: <ShoppingBag className="h-4 w-4" />, label: "New Applications", value: "new" }
  ];

  const vendorData = [
    { id: 1, name: "Green Farms Co-op", status: "active", productCount: 32, revenue: "₱325,650", joinDate: "Jan 2023" },
    { id: 2, name: "Local Crafts Association", status: "active", productCount: 56, revenue: "₱215,470", joinDate: "Mar 2023" },
    { id: 3, name: "Tropical Treats Foods", status: "active", productCount: 24, revenue: "₱189,320", joinDate: "Apr 2023" },
    { id: 4, name: "Eco Friends Philippines", status: "active", productCount: 12, revenue: "₱97,850", joinDate: "Jul 2023" },
    { id: 5, name: "Mountain Coffee Roasters", status: "pending", productCount: 0, revenue: "₱0", joinDate: "Apr 2025" },
    { id: 6, name: "Island Spice Co.", status: "suspended", productCount: 8, revenue: "₱45,320", joinDate: "Dec 2023" }
  ];

  const vendorPerformanceData = [
    { name: 'Jan', "Green Farms": 12500, "Local Crafts": 8200, "Tropical Treats": 5400 },
    { name: 'Feb', "Green Farms": 15200, "Local Crafts": 9100, "Tropical Treats": 7300 },
    { name: 'Mar', "Green Farms": 18900, "Local Crafts": 10500, "Tropical Treats": 8200 },
    { name: 'Apr', "Green Farms": 23400, "Local Crafts": 12700, "Tropical Treats": 11800 }
  ];

  const breadcrumbItems = [
    { label: "Smarketplace", href: "/admin/smarketplace" },
    { label: "Vendors" }
  ];

  return (
    <AdminLayout title="All Vendors">
      <DashboardPageHeader
        title="Vendor Management"
        description="View and manage marketplace vendors"
        breadcrumbItems={breadcrumbItems}
        actionButton={{
          label: "Add Vendor",
          onClick: () => console.log("Add vendor clicked"),
          icon: <PlusCircle className="h-4 w-4" />
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Vendors"
          value="58"
          change={{ value: 3, isPositive: true }}
          icon={<Users className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard 
          title="Active Vendors"
          value="52"
          icon={<Star className="h-5 w-5 text-green-500" />}
          iconColor="bg-green-50"
        />
        <StatsCard 
          title="Pending Applications"
          value="6"
          change={{ value: 2, isPositive: true }}
          icon={<ShoppingBag className="h-5 w-5 text-amber-500" />}
          iconColor="bg-amber-50"
        />
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vendor Performance (2025)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₱${value/1000}K`} />
              <Tooltip formatter={(value) => [`₱${value}`, 'Revenue']} />
              <Legend />
              <Bar dataKey="Green Farms" fill="#10b981" name="Green Farms Co-op" />
              <Bar dataKey="Local Crafts" fill="#3b82f6" name="Local Crafts Association" />
              <Bar dataKey="Tropical Treats" fill="#f59e0b" name="Tropical Treats Foods" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search vendors..." className="pl-9" />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ModernTabs defaultValue="all" items={tabItems}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {vendorData.map((vendor) => (
            <VendorCard
              key={vendor.id}
              name={vendor.name}
              status={vendor.status as any}
              productCount={vendor.productCount}
              revenue={vendor.revenue}
              joinDate={vendor.joinDate}
            />
          ))}
        </div>
      </ModernTabs>
    </AdminLayout>
  );
};

export default VendorsAllPage;
