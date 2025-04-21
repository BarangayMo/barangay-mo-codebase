
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { 
  Users, 
  Briefcase, 
  ShoppingCart, 
  Building, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample data for charts
const barData = [
  { name: 'Jan', residents: 400, officials: 240 },
  { name: 'Feb', residents: 300, officials: 139 },
  { name: 'Mar', residents: 200, officials: 980 },
  { name: 'Apr', residents: 278, officials: 390 },
  { name: 'May', residents: 189, officials: 480 },
  { name: 'Jun', residents: 239, officials: 380 },
];

const pieData = [
  { name: 'Quezon City', value: 400 },
  { name: 'Manila', value: 300 },
  { name: 'Makati', value: 300 },
  { name: 'Pasig', value: 200 },
];

const lineData = [
  { name: 'Week 1', jobs: 40, products: 24 },
  { name: 'Week 2', jobs: 30, products: 13 },
  { name: 'Week 3', jobs: 20, products: 98 },
  { name: 'Week 4', jobs: 27, products: 39 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Redirect if not superadmin
  if (userRole !== 'superadmin') {
    navigate("/");
    return null;
  }
  
  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    trendValue 
  }: { 
    title: string; 
    value: string; 
    subtitle: string; 
    icon: any; 
    trend: 'up' | 'down'; 
    trendValue: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          {trend === 'up' ? (
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span className={trend === 'up' ? "text-green-500" : "text-red-500"}>
            {trendValue}
          </span>
          <span className="text-muted-foreground ml-1">{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Admin! Here's what's happening.
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button>Export Data</Button>
            <Button variant="outline">Settings</Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                title="Total Users"
                value="56,789"
                subtitle="since last month"
                icon={Users}
                trend="up"
                trendValue="+12%"
              />
              <StatCard 
                title="Barangays"
                value="234"
                subtitle="total registered"
                icon={Building}
                trend="up"
                trendValue="+3%"
              />
              <StatCard 
                title="Active Jobs"
                value="1,234"
                subtitle="since last week"
                icon={Briefcase}
                trend="down"
                trendValue="-2%"
              />
              <StatCard 
                title="Products Listed"
                value="5,678"
                subtitle="in marketplace"
                icon={ShoppingCart}
                trend="up"
                trendValue="+8%"
              />
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>User Registration Trends</CardTitle>
                  <CardDescription>
                    New users registered per month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="residents" fill="#4CAF50" name="Residents" />
                        <Bar dataKey="officials" fill="#ea384c" name="Officials" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution by Location</CardTitle>
                  <CardDescription>
                    Total users across barangays
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Jobs and product listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="jobs" 
                          stroke="#ea384c" 
                          activeDot={{ r: 8 }}
                          name="Job Listings"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="products" 
                          stroke="#4CAF50" 
                          name="Product Listings"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest actions across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start">
                      <div className="mr-4 rounded-full bg-primary/10 p-2">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {["New barangay registered", "User complaint resolved", "Product listing approved", "Job application reviewed", "Official account verified"][i-1]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {["Makati City", "Quezon City", "Manila", "Pasig City", "Taguig City"][i-1]}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center text-sm text-muted-foreground">
                        <CalendarDays className="mr-1 h-3 w-3" />
                        {["2 hours ago", "5 hours ago", "Yesterday", "2 days ago", "1 week ago"][i-1]}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Content</CardTitle>
                <CardDescription>
                  Detailed analytics information would be displayed here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Advanced analytics dashboard to be implemented.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports Content</CardTitle>
                <CardDescription>
                  Generated reports would be displayed here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Report generation features to be implemented.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
