
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
  CalendarDays,
  Filter,
  Search,
  Download,
  X,
  FileText,
  ClipboardList,
  Package,
  ShoppingBag,
  FileBarChart,
  UserCheck,
  FileSignature
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";

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
  const [showWelcomePanel, setShowWelcomePanel] = useState(true);
  
  // Redirect if not superadmin
  if (userRole !== 'superadmin') {
    navigate("/");
    return null;
  }
  
  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    trend, 
    trendValue 
  }: { 
    title: string; 
    value: string; 
    subtitle: string; 
    trend: 'up' | 'down'; 
    trendValue: string;
  }) => (
    <Card className="bg-white border-0">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`rounded-full p-1 ${trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
            {trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
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
        {/* Welcome panel with gradient background */}
        {showWelcomePanel && (
          <div className="rounded-xl bg-gradient-to-r from-purple-200 to-pink-200 mb-6 p-6 relative">
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-2 right-2 rounded-full hover:bg-purple-300/20"
              onClick={() => setShowWelcomePanel(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="max-w-lg">
              <h1 className="text-2xl md:text-3xl font-bold">Welcome back Williams</h1>
              <p className="text-gray-700">Manage your barangay operations with ease</p>
              
              {/* Task checklist */}
              <div className="mt-8 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500 text-white rounded-full p-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Approve business permits</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-500 text-white rounded-full p-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Review barangay budget allocations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-500 text-white rounded-full p-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Verify new resident registrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-500 text-white rounded-full p-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Respond to community concerns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-500 text-white rounded-full p-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>Schedule community events</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Budget Overview</h2>
            
            <div className="flex gap-2">
              <Button variant="outline">Select Quarter</Button>
              <Button>Create New Report</Button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500">Total Budget Allocated</p>
            <p className="text-3xl font-bold text-green-800 mt-1">₱45,200,643.00</p>
            <p className="text-sm text-gray-500 mt-1"><span className="text-green-500 font-medium">+19.20%</span> from last quarter</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="font-medium text-gray-500">Projects</div>
                <div className="text-2xl font-bold mt-1">56</div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="font-medium text-gray-500">Pending Approval</div>
                <div className="text-2xl font-bold mt-1">78</div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="font-medium text-gray-500">Rejected</div>
                <div className="text-2xl font-bold mt-1">12</div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <Tabs defaultValue="expenditures" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="expenditures">Expenditures</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expenditures">
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">Approved</Button>
                <Button variant="ghost">Pending</Button>
                <Button variant="ghost">Rejected</Button>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-6 justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className="pl-10" placeholder="Search expenditures" />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline">Sort</Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="pb-3">DATE</th>
                      <th className="pb-3">AMOUNT</th>
                      <th className="pb-3">CATEGORY</th>
                      <th className="pb-3">DESCRIPTION</th>
                      <th className="pb-3">REPORT</th>
                      <th className="pb-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="h-16 border-b border-gray-100">
                      <td className="py-4">April 15, 2025</td>
                      <td className="py-4">₱235,000.00</td>
                      <td className="py-4">Infrastructure</td>
                      <td className="py-4">Road repairs</td>
                      <td className="py-4">Q2-2025</td>
                      <td className="py-4"><span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Approved</span></td>
                    </tr>
                    <tr className="h-16 border-b border-gray-100">
                      <td className="py-4">April 12, 2025</td>
                      <td className="py-4">₱125,600.00</td>
                      <td className="py-4">Health</td>
                      <td className="py-4">Medical supplies</td>
                      <td className="py-4">Q2-2025</td>
                      <td className="py-4"><span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Pending</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="marketplace">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Marketplace Management</h3>
                <Button>
                  <Package className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Products</h4>
                      <p className="text-2xl font-bold">437</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Orders</h4>
                      <p className="text-2xl font-bold">126</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Vendors</h4>
                      <p className="text-2xl font-bold">58</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <FileBarChart className="h-5 w-5 text-amber-600" />
                    <div>
                      <h4 className="font-medium">Revenue</h4>
                      <p className="text-2xl font-bold">₱125K</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Manage Products
                </Button>
                <Button variant="outline" className="justify-start">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  View Orders
                </Button>
                <Button variant="outline" className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Vendors
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileBarChart className="h-4 w-4 mr-2" />
                  Sales Reports
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="jobs">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Jobs Management</h3>
                <Button>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Active Jobs</h4>
                      <p className="text-2xl font-bold">86</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Applications</h4>
                      <p className="text-2xl font-bold">243</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Employers</h4>
                      <p className="text-2xl font-bold">37</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-amber-600" />
                    <div>
                      <h4 className="font-medium">Placements</h4>
                      <p className="text-2xl font-bold">62</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Manage Job Listings
                </Button>
                <Button variant="outline" className="justify-start">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Review Applications
                </Button>
                <Button variant="outline" className="justify-start">
                  <Building className="h-4 w-4 mr-2" />
                  Manage Employers
                </Button>
                <Button variant="outline" className="justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Employment Reports
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Documents Management</h3>
                <Button>
                  <FileSignature className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Certificates</h4>
                      <p className="text-2xl font-bold">142</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Permits</h4>
                      <p className="text-2xl font-bold">95</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <FileSignature className="h-5 w-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Clearances</h4>
                      <p className="text-2xl font-bold">214</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-amber-600" />
                    <div>
                      <h4 className="font-medium">Pending</h4>
                      <p className="text-2xl font-bold">47</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Templates
                </Button>
                <Button variant="outline" className="justify-start">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Process Requests
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileSignature className="h-4 w-4 mr-2" />
                  Approval Queue
                </Button>
                <Button variant="outline" className="justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Document Reports
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
