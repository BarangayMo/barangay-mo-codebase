
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Calendar, ChevronDown, Filter } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FinancialReportsPage = () => {
  const [dateRange, setDateRange] = useState("month");

  // Sample data
  const monthlySalesData = [
    { month: "Jan", revenue: 12500, expenses: 8000, profit: 4500 },
    { month: "Feb", revenue: 15000, expenses: 8500, profit: 6500 },
    { month: "Mar", revenue: 18000, expenses: 9000, profit: 9000 },
    { month: "Apr", revenue: 16000, expenses: 8800, profit: 7200 },
    { month: "May", revenue: 21000, expenses: 10000, profit: 11000 },
    { month: "Jun", revenue: 22000, expenses: 11000, profit: 11000 },
    { month: "Jul", revenue: 24000, expenses: 11500, profit: 12500 },
  ];
  
  const revenueSourcesData = [
    { name: "Product Sales", value: 65 },
    { name: "Commission", value: 25 },
    { name: "Subscriptions", value: 10 },
  ];
  
  const transactions = [
    { id: "TRX-7829", type: "Revenue", category: "Sales", date: "Jul 24, 2025", amount: "₱2,347.00" },
    { id: "TRX-7823", type: "Expense", category: "Vendor Payout", date: "Jul 23, 2025", amount: "₱1,200.50" },
    { id: "TRX-7814", type: "Revenue", category: "Commission", date: "Jul 21, 2025", amount: "₱356.25" },
    { id: "TRX-7810", type: "Expense", category: "Refund", date: "Jul 20, 2025", amount: "₱180.75" },
    { id: "TRX-7805", type: "Revenue", category: "Subscription", date: "Jul 19, 2025", amount: "₱499.00" },
  ];

  return (
    <AdminLayout title="Financial Reports">
      <DashboardPageHeader
        title="Financial Reports"
        description="Detailed financial analysis and reporting"
        breadcrumbItems={[
          { label: "Dashboard", href: "/admin" },
          { label: "Reports", href: "/admin/reports" },
          { label: "Financial" }
        ]}
        actionButton={{
          label: "Export Report",
          onClick: () => console.log("Export report"),
          icon: <ArrowDownToLine className="h-4 w-4" />
        }}
      />

      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">₱137,500</CardTitle>
                <CardDescription>Total Revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-green-600 font-medium">
                  +12.5% from last month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">₱67,800</CardTitle>
                <CardDescription>Total Expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-red-600 font-medium">
                  +8.3% from last month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">₱69,700</CardTitle>
                <CardDescription>Net Profit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-green-600 font-medium">
                  +16.8% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Monthly financial performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₱${value}`} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                    <Bar dataKey="profit" name="Profit" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlySalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₱${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest financial activities</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.id}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            tx.type === "Revenue" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {tx.type}
                          </span>
                        </TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell className="text-right">{tx.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 border-t text-center">
                  <Button variant="outline">View All Transactions</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Detailed revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center p-8 text-muted-foreground">
                Revenue analysis details would be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Analysis</CardTitle>
              <CardDescription>Detailed expense breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center p-8 text-muted-foreground">
                Expense analysis details would be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Statement</CardTitle>
              <CardDescription>Comprehensive P&L analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center p-8 text-muted-foreground">
                Profit & Loss statement details would be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default FinancialReportsPage;
