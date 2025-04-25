import { useState } from "react";
import { LayoutDashboard, Users, ShoppingBag, Package, BarChartIcon, ArrowUp, ArrowDown, User, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminDashboard = () => {
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
  
  const vendorData = [
    { name: 'Green Farms Co-op', value: 45 },
    { name: 'Local Crafts', value: 28 },
    { name: 'Eco Friends PH', value: 15 },
    { name: 'Tropical Treats', value: 12 },
  ];

  const recentOrders = [
    { id: "ORD-7829", customer: "Sofia Lopez", date: "Today, 10:30 AM", amount: "₱2,347.00", status: "processing" },
    { id: "ORD-7823", customer: "Miguel Santos", date: "Yesterday, 3:15 PM", amount: "₱1,200.50", status: "shipping" },
    { id: "ORD-7814", customer: "Ana Garcia", date: "Apr 21, 2025", amount: "₱3,756.25", status: "delivered" },
    { id: "ORD-7810", customer: "Juan Cruz", date: "Apr 20, 2025", amount: "₱980.75", status: "delivered" },
  ];

  const recentActivities = [
    { 
      id: 1, 
      user: "Sofia Lopez", 
      action: "purchased", 
      target: "Organic Rice (5kg)",
      time: "20 minutes ago",
      avatar: ""
    },
    { 
      id: 2, 
      user: "Admin", 
      action: "updated product", 
      target: "Bamboo Toothbrush",
      time: "45 minutes ago",
      avatar: ""
    },
    { 
      id: 3, 
      user: "Green Farms Co-op", 
      action: "listed new product", 
      target: "Organic Quinoa (500g)",
      time: "1 hour ago",
      avatar: ""
    },
    { 
      id: 4, 
      user: "Support Team", 
      action: "resolved issue", 
      target: "Order #ORD-7812",
      time: "2 hours ago",
      avatar: ""
    },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'processing':
        return <Badge className="bg-amber-500">Processing</Badge>;
      case 'shipping':
        return <Badge className="bg-blue-500">Shipping</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <DashboardPageHeader
        title="Marketplace Dashboard"
        description="Overview of your marketplace performance and activities"
        breadcrumbItems={[{ label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Revenue"
          value="₱125,650"
          change={{ value: 12, isPositive: true }}
          icon={<BarChartIcon className="h-5 w-5 text-blue-500" />}
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
          title="Total Customers"
          value="1,249"
          change={{ value: 5, isPositive: true }}
          icon={<User className="h-5 w-5 text-amber-500" />}
          iconColor="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Daily sales performance</CardDescription>
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
              <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₱${value/1000}K`} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="Sales (₱)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Orders" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
                    {index === 0 && (
                      <span className="text-xs text-green-600">
                        <ArrowUp className="h-3 w-3 inline" /> 5%
                      </span>
                    )}
                    {index === 2 && (
                      <span className="text-xs text-red-600">
                        <ArrowDown className="h-3 w-3 inline" /> 2%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your marketplace</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t text-center">
              <Button variant="outline">View All Orders</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your marketplace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback>{activity.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {" "}{activity.action}{" "}
                    <span className="font-medium text-primary">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> {activity.time}
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

export default AdminDashboard;
