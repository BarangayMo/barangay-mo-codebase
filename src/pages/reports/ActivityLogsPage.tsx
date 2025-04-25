
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Download, Filter, Search, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const ActivityLogsPage = () => {
  const [filter, setFilter] = useState("all");
  
  // Sample data
  const activityLogs = [
    { 
      id: 1, 
      user: "Admin User", 
      action: "Updated product", 
      target: "Organic Rice (5kg)",
      type: "product",
      time: "Today, 10:30 AM",
      ip: "192.168.1.1",
    },
    { 
      id: 2, 
      user: "John Smith", 
      action: "Created new vendor account", 
      target: "Local Crafts Co.",
      type: "vendor",
      time: "Today, 09:15 AM",
      ip: "192.168.1.45",
    },
    { 
      id: 3, 
      user: "System", 
      action: "Processed order", 
      target: "ORD-7820",
      type: "order",
      time: "Yesterday, 3:45 PM",
      ip: "System",
    },
    { 
      id: 4, 
      user: "Maria Garcia", 
      action: "Updated customer details", 
      target: "Ana Santos",
      type: "customer",
      time: "Yesterday, 2:30 PM",
      ip: "192.168.2.15",
    },
    { 
      id: 5, 
      user: "Admin User", 
      action: "Changed system settings", 
      target: "Payment Gateway",
      type: "system",
      time: "Jul 23, 2025",
      ip: "192.168.1.1",
    },
    { 
      id: 6, 
      user: "Jose Reyes", 
      action: "Added new product", 
      target: "Bamboo Toothbrush",
      type: "product",
      time: "Jul 22, 2025",
      ip: "192.168.3.21",
    },
    { 
      id: 7, 
      user: "System", 
      action: "Failed login attempt", 
      target: "unknown@example.com",
      type: "security",
      time: "Jul 21, 2025",
      ip: "203.0.113.42",
    },
  ];

  const getActivityTypeIcon = (type: string) => {
    switch(type) {
      case 'product':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Product</Badge>;
      case 'vendor':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Vendor</Badge>;
      case 'order':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Order</Badge>;
      case 'customer':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Customer</Badge>;
      case 'system':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">System</Badge>;
      case 'security':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Security</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  const filteredLogs = filter === "all" ? 
    activityLogs : 
    activityLogs.filter(log => log.type === filter);

  return (
    <AdminLayout title="Activity Logs">
      <DashboardPageHeader
        title="Activity Logs"
        description="Comprehensive log of all system activities"
        breadcrumbItems={[
          { label: "Dashboard", href: "/admin" },
          { label: "Reports", href: "/admin/reports" },
          { label: "Activity Logs" }
        ]}
        actionButton={{
          label: "Export Logs",
          onClick: () => console.log("Export logs"),
          icon: <Download className="h-4 w-4" />
        }}
      />

      <div className="mb-6 space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search logs..." 
                  className="pl-9 w-full" 
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select defaultValue="all" onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="product">Products</SelectItem>
                    <SelectItem value="vendor">Vendors</SelectItem>
                    <SelectItem value="order">Orders</SelectItem>
                    <SelectItem value="customer">Customers</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date Range</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>Track all activities in the system</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs">
                            {log.user === "System" ? "SYS" : log.user.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span>{log.action}</span>
                        <span className="ml-1 text-muted-foreground">
                          {log.target ? `"${log.target}"` : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getActivityTypeIcon(log.type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{log.time}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredLogs.length} of {activityLogs.length} entries
              </div>
              <Button variant="outline">Load More</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ActivityLogsPage;
