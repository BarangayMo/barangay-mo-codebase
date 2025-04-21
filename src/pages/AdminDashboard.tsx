
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
  Download
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
        <div className="rounded-xl bg-gradient-to-r from-purple-200 to-pink-200 mb-6 p-6">
          <div className="max-w-lg">
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back Williams</h1>
            <p className="text-gray-700">Automate your financial operations with ease</p>
            
            {/* Task checklist */}
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Create an expense account</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Make a local or international payment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Set up an approval workflow</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Claim a reimbursement</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Automatically screen for expense fraud</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Expenses - My Expenses</h2>
            
            <div className="flex gap-2">
              <Button variant="outline">Select Currency</Button>
              <Button>Create New Expense</Button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500">Expense Amount Submitted</p>
            <p className="text-3xl font-bold text-green-800 mt-1">₦45,200,643.00</p>
            <p className="text-sm text-gray-500 mt-1"><span className="text-green-500 font-medium">+19.20%</span> from last week</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="font-medium text-gray-500">Submitted</div>
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
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Expenses</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">Saved</Button>
            <Button variant="ghost">Reported</Button>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-10" placeholder="Search" />
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
                  <th className="pb-3">DATE CREATED</th>
                  <th className="pb-3">AMOUNT</th>
                  <th className="pb-3">CATEGORY</th>
                  <th className="pb-3">DESCRIPTION</th>
                  <th className="pb-3">REPORT</th>
                  <th className="pb-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {/* Table content would go here */}
                <tr className="h-16 border-b border-gray-100">
                  <td colSpan={6} className="text-center text-gray-500">No expenses found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
