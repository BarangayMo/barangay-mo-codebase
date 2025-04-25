
import { useState } from "react";
import { BarChart, ShoppingBag, Package, Users, DollarSign, ArrowUp, ArrowDown, Calendar, PieChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const SmarketplaceOverview = () => {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('week');
  
  // Sample data
  const revenueData = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 },
    { name: 'Jun', value: 67000 },
    { name: 'Jul', value: 72000 },
  ];

  const categoryData = [
    { name: 'Organic Food', value: 35 },
    { name: 'Crafts', value: 25 },
    { name: 'Eco Products', value: 20 },
    { name: 'Others', value: 20 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const recentTransactions = [
    { id: "TRX-7829", vendor: "Green Farms Co-op", date: "Today, 10:30 AM", amount: "₱2,347.00", status: "completed" },
    { id: "TRX-7823", vendor: "Local Crafts", date: "Yesterday, 3:15 PM", amount: "₱1,200.50", status: "pending" },
    { id: "TRX-7814", vendor: "Eco Friends PH", date: "Apr 21, 2025", amount: "₱3,756.25", status: "completed" },
    { id: "TRX-7810", vendor: "Tropical Treats", date: "Apr 20, 2025", amount: "₱980.75", status: "failed" },
  ];

  const topVendors = [
    { id: 1, name: "Green Farms Co-op", sales: "₱24,500", products: 32, growth: 12 },
    { id: 2, name: "Local Crafts", sales: "₱18,720", products: 24, growth: 8 },
    { id: 3, name: "Eco Friends PH", sales: "₱12,430", products: 18, growth: -3 },
    { id: 4, name: "Tropical Treats", sales: "₱10,890", products: 15, growth: 5 },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <AdminLayout title="Marketplace Overview">
      <DashboardPageHeader
        title="Marketplace Overview"
        description="Key metrics and performance of your marketplace"
        breadcrumbItems={[
          { label: "Dashboard", href: "/admin" },
          { label: "Smarketplace", href: "/admin/smarketplace" },
          { label: "Overview" }
        ]}
        actionButton={{
          label: "Generate Report",
          onClick: () => console.log("Generate report"),
          icon: <Calendar className="h-4 w-4" />
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Revenue"
          value="₱325,750"
          change={{ value: 15, isPositive: true }}
          icon={<DollarSign className="h-5 w-5 text-green-500" />}
          iconColor="bg-green-50"
          chart={
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Area type="monotone" dataKey="value" stroke="#22c55e" fill="#22c55e20" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          }
        />
        <StatsCard 
          title="Active Vendors"
          value="58"
          change={{ value: 12, isPositive: true }}
          icon={<Users className="h-5 w-5 text-blue-500" />}
          iconColor="bg-blue-50"
        />
        <StatsCard 
          title="Total Products"
          value="1,245"
          change={{ value: 8, isPositive: true }}
          icon={<ShoppingBag className="h-5 w-5 text-purple-500" />}
          iconColor="bg-purple-50"
        />
        <StatsCard 
          title="Orders Today"
          value="124"
          change={{ value: 4, isPositive: true }}
          icon={<Package className="h-5 w-5 text-amber-500" />}
          iconColor="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </div>
              <div>
                <Tabs defaultValue="week">
                  <TabsList>
                    <TabsTrigger value="today" onClick={() => setDateRange('today')}>Today</TabsTrigger>
                    <TabsTrigger value="week" onClick={() => setDateRange('week')}>Week</TabsTrigger>
                    <TabsTrigger value="month" onClick={() => setDateRange('month')}>Month</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₱${value/1000}K`} />
                <Tooltip formatter={(value) => [`₱${value}`, 'Revenue']} />
                <Legend />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f620" strokeWidth={2} name="Revenue (₱)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[230px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activities in your marketplace</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{tx.id}</TableCell>
                    <TableCell>{tx.vendor}</TableCell>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t text-center">
              <Button variant="outline">View All Transactions</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
            <CardDescription>Vendors with highest sales this month</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topVendors.map((vendor) => (
                  <TableRow key={vendor.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{vendor.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{vendor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{vendor.sales}</TableCell>
                    <TableCell>{vendor.products}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {vendor.growth > 0 ? (
                          <span className="text-green-600 flex items-center">
                            <ArrowUp className="h-3 w-3 mr-1" /> {vendor.growth}%
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <ArrowDown className="h-3 w-3 mr-1" /> {Math.abs(vendor.growth)}%
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t text-center">
              <Button variant="outline">View All Vendors</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SmarketplaceOverview;
