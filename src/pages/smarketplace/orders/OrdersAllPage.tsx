import { useState } from "react";
import { Package, Check, Clock, AlertCircle, ShoppingCart, Search, Filter, Calendar } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { ModernTabs } from "@/components/dashboard/ModernTabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TimelineCard } from "@/components/dashboard/TimelineCard";
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

type OrderStatus = 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';

const orderTimelineData = [
  {
    orderId: "ORD-7829",
    date: "Today, 10:30 AM",
    steps: [
      { status: 'processing' as OrderStatus, label: 'Order Placed', date: 'Today, 10:30 AM', isCompleted: true, isCurrent: false },
      { status: 'processing' as OrderStatus, label: 'Processing', date: 'Today, 11:45 AM', isCompleted: true, isCurrent: true },
      { status: 'shipping' as OrderStatus, label: 'Shipped', date: '', isCompleted: false, isCurrent: false },
      { status: 'delivered' as OrderStatus, label: 'Delivered', date: '', isCompleted: false, isCurrent: false },
    ]
  },
  {
    orderId: "ORD-7823",
    date: "Yesterday, 3:15 PM",
    steps: [
      { status: 'processing' as OrderStatus, label: 'Order Placed', date: 'Yesterday, 3:15 PM', isCompleted: true, isCurrent: false },
      { status: 'processing' as OrderStatus, label: 'Processing', date: 'Yesterday, 4:30 PM', isCompleted: true, isCurrent: false },
      { status: 'shipping' as OrderStatus, label: 'Shipped', date: 'Today, 9:00 AM', isCompleted: true, isCurrent: true },
      { status: 'delivered' as OrderStatus, label: 'Delivered', date: '', isCompleted: false, isCurrent: false },
    ]
  },
  {
    orderId: "ORD-7814",
    date: "Apr 21, 2025",
    steps: [
      { status: 'processing' as OrderStatus, label: 'Order Placed', date: 'Apr 21, 2025', isCompleted: true, isCurrent: false },
      { status: 'processing' as OrderStatus, label: 'Processing', date: 'Apr 21, 2025', isCompleted: true, isCurrent: false },
      { status: 'shipping' as OrderStatus, label: 'Shipped', date: 'Apr 22, 2025', isCompleted: true, isCurrent: false },
      { status: 'delivered' as OrderStatus, label: 'Delivered', date: 'Apr 23, 2025', isCompleted: true, isCurrent: true },
    ]
  },
];

const OrdersAllPage = () => {
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
    { icon: <Package className="h-4 w-4" />, label: "All", value: "all" },
    { icon: <Clock className="h-4 w-4" />, label: "Processing", value: "processing" },
    { icon: <Check className="h-4 w-4" />, label: "Completed", value: "completed" },
    { icon: <AlertCircle className="h-4 w-4" />, label: "Issues", value: "issues" },
    { icon: <ShoppingCart className="h-4 w-4" />, label: "Abandoned", value: "abandoned" }
  ];

  const orderTableData = [
    { id: "ORD-7829", date: "Today, 10:30 AM", customer: "Sofia Lopez", status: "processing", total: "₱2,347.00" },
    { id: "ORD-7823", date: "Yesterday, 3:15 PM", customer: "Miguel Santos", status: "shipping", total: "₱1,200.50" },
    { id: "ORD-7814", date: "Apr 21, 2025", customer: "Ana Garcia", status: "delivered", total: "₱3,756.25" },
    { id: "ORD-7810", date: "Apr 20, 2025", customer: "Juan Cruz", status: "delivered", total: "₱980.75" },
    { id: "ORD-7802", date: "Apr 19, 2025", customer: "Maria Reyes", status: "cancelled", total: "₱1,540.00" }
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
      case 'refunded':
        return <Badge className="bg-purple-500">Refunded</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const breadcrumbItems = [
    { label: "Smarketplace", href: "/admin/smarketplace" },
    { label: "Orders" }
  ];

  return (
    <AdminLayout title="All Orders">
      <DashboardPageHeader
        title="Orders Management"
        description="View and manage customer orders"
        breadcrumbItems={breadcrumbItems}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Orders Today"
          value="12"
          change={{ value: 15, isPositive: true }}
          icon={<Package className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard 
          title="Processing"
          value="5"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          iconColor="bg-amber-50"
        />
        <StatsCard 
          title="Completed"
          value="324"
          change={{ value: 8, isPositive: true }}
          icon={<Check className="h-5 w-5 text-green-500" />}
          iconColor="bg-green-50"
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search orders..." className="pl-9" />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipping">Shipping</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </Button>

          <Button variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ModernTabs defaultValue="all" items={tabItems}>
        <div className="grid grid-cols-1 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {orderTimelineData.map((order) => (
                <TimelineCard 
                  key={order.orderId}
                  orderId={order.orderId}
                  date={order.date}
                  steps={order.steps}
                />
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px] cursor-pointer" onClick={() => handleSort('id')}>
                      Order ID {sortColumn === 'id' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                      Date {sortColumn === 'date' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('customer')}>
                      Customer {sortColumn === 'customer' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => handleSort('total')}>
                      Total {sortColumn === 'total' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderTableData.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">{order.total}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </ModernTabs>
    </AdminLayout>
  );
};

export default OrdersAllPage;
