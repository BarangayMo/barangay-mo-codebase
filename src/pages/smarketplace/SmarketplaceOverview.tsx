
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { 
  ShoppingBag, 
  Package, 
  Users, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SmarketplaceOverview = () => {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter'>('week');
  
  const salesData = [
    { name: 'Apr 18', sales: 18500, orders: 12 },
    { name: 'Apr 19', sales: 12500, orders: 8 },
    { name: 'Apr 20', sales: 15000, orders: 10 },
    { name: 'Apr 21', sales: 22000, orders: 15 },
    { name: 'Apr 22', sales: 19500, orders: 13 },
    { name: 'Apr 23', sales: 24000, orders: 18 },
    { name: 'Apr 24', sales: 25000, orders: 20 },
  ];
  
  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3b82f6' },
    { name: 'Clothing', value: 25, color: '#10b981' },
    { name: 'Home Goods', value: 20, color: '#8b5cf6' },
    { name: 'Food', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#6b7280' },
  ];
  
  const vendorData = [
    { name: 'Green Farms Co-op', value: 45, change: 5 },
    { name: 'Local Crafts', value: 28, change: 2 },
    { name: 'Eco Friends PH', value: 15, change: -2 },
    { name: 'Tropical Treats', value: 12, change: 1 },
  ];

  const topProducts = [
    { id: 1, name: "Organic Rice (5kg)", sales: 245, price: "₱425.00", stock: 58 },
    { id: 2, name: "Bamboo Toothbrush", sales: 189, price: "₱120.00", stock: 176 },
    { id: 3, name: "Handwoven Basket", sales: 153, price: "₱350.00", stock: 42 },
    { id: 4, name: "Coconut Bowl Set", sales: 142, price: "₱480.00", stock: 23 },
  ];

  const recentVendorActivity = [
    { 
      id: 1, 
      vendor: "Green Farms Co-op", 
      action: "added new product", 
      product: "Organic Black Rice (1kg)",
      time: "20 minutes ago",
      avatar: ""
    },
    { 
      id: 2, 
      vendor: "Local Crafts", 
      action: "updated inventory", 
      product: "Handwoven Placemat",
      time: "45 minutes ago",
      avatar: ""
    },
    { 
      id: 3, 
      vendor: "Eco Friends PH", 
      action: "changed price for", 
      product: "Reusable Produce Bags",
      time: "1 hour ago",
      avatar: ""
    },
    { 
      id: 4, 
      vendor: "Tropical Treats", 
      action: "added promotion for", 
      product: "Dried Mango Pack",
      time: "2 hours ago",
      avatar: ""
    },
  ];

  return (
    <AdminLayout title="Smarketplace Overview">
      <DashboardPageHeader
        title="Marketplace Overview"
        description="Analytics and insights for your marketplace"
        breadcrumbItems={[
          { label: "Dashboard", href: "/admin" },
          { label: "Smarketplace", href: "/admin/smarketplace" },
          { label: "Overview" }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Revenue"
          value="₱125,650"
          change={{ value: 12, isPositive: true }}
          icon={<CreditCard className="h-5 w-5 text-blue-500" />}
          chart={
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          }
        />
        <StatsCard 
          title="Total Orders"
          value="324"
          change={{ value: 8, isPositive: true }}
          icon={<Package className="h-5 w-5 text-green-500" />}
          iconColor="bg-green-50"
        />
        <StatsCard 
          title="Active Vendors"
          value="58"
          change={{ value: 3, isPositive: true }}
          icon={<Users className="h-5 w-5 text-purple-500" />}
          iconColor="bg-purple-50"
        />
        <StatsCard 
          title="Active Listings"
          value="1,246"
          change={{ value: 15, isPositive: true }}
          icon={<ShoppingBag className="h-5 w-5 text-amber-500" />}
          iconColor="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Revenue and orders over time</CardDescription>
              </div>
              <div>
                <Tabs defaultValue="week">
                  <TabsList>
                    <TabsTrigger value="today" onClick={() => setDateRange('today')}>Today</TabsTrigger>
                    <TabsTrigger value="week" onClick={() => setDateRange('week')}>Week</TabsTrigger>
                    <TabsTrigger value="month" onClick={() => setDateRange('month')}>Month</TabsTrigger>
                    <TabsTrigger value="quarter" onClick={() => setDateRange('quarter')}>Quarter</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={(value) => `₱${value/1000}K`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#3b82f6" fill="#93c5fd" strokeWidth={2} name="Sales (₱)" />
                <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#10b981" fill="#6ee7b7" strokeWidth={2} name="Orders" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Products by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>By sales volume</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={vendorData} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-3">
              {vendorData.map((vendor, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="text-sm">{vendor.name}</p>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{vendor.value}%</span>
                    {vendor.change > 0 && (
                      <span className="text-xs text-green-600">
                        <ArrowUp className="h-3 w-3 inline" /> {vendor.change}%
                      </span>
                    )}
                    {vendor.change < 0 && (
                      <span className="text-xs text-red-600">
                        <ArrowDown className="h-3 w-3 inline" /> {Math.abs(vendor.change)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling items</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{product.sales}</TableCell>
                    <TableCell className="text-right">{product.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t text-center">
              <Button variant="outline">View All Products</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Activity</CardTitle>
            <CardDescription>Recent vendor actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentVendorActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback>{activity.vendor.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.vendor}</span>
                    {" "}{activity.action}{" "}
                    <span className="font-medium text-primary">{activity.product}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t text-center">
              <Button variant="outline">View All Activity</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SmarketplaceOverview;
