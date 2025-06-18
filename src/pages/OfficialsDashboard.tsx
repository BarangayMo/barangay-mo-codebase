
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Bell, 
  Settings,
  Plus,
  Eye,
  Edit,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  AlertTriangle
} from "lucide-react";
import { OfficialStats } from "@/components/officials/OfficialStats";
import { BudgetOverview } from "@/components/officials/BudgetOverview";
import { RecentActivity } from "@/components/officials/RecentActivity";
import { UpcomingEvents } from "@/components/officials/UpcomingEvents";
import { CampaignMetrics } from "@/components/officials/CampaignMetrics";

const OfficialsDashboard = () => {
  return (
    <Layout>
      <Helmet>
        <title>Officials Dashboard - BarangayMo</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="grid gap-6 mb-8">
          <Card className="bg-gradient-to-r from-[#ea384c] to-[#ff6b78] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-white/20">
                  <AvatarImage src="/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" />
                  <AvatarFallback>BC</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">Juan Dela Cruz</h2>
                  <p className="text-white/90">Barangay Captain</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                    <div>
                      <p className="text-sm text-white/80">Ward</p>
                      <p className="font-semibold">Ward 7</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/80">ID Number</p>
                      <p className="font-semibold">#123456</p>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      Active Term
                    </Badge>
                  </div>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#ea384c]">Officials Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your barangay operations and connect with your community</p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-[#ea384c] hover:bg-[#d12d41]">
                <Link to="/officials/campaigns/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/officials/events/new">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Event
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <OfficialStats />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Budget Overview */}
          <div className="lg:col-span-2">
            <BudgetOverview />
          </div>
          
          {/* Campaign Metrics */}
          <div>
            <CampaignMetrics />
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <RecentActivity />
          
          {/* Upcoming Events */}
          <UpcomingEvents />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/officials/budget">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-[#ea384c] mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Budget Management</h3>
                <p className="text-sm text-gray-600">Track and manage barangay budget allocations</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/officials/documents">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-[#ea384c] mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Documents</h3>
                <p className="text-sm text-gray-600">Manage official documents and ordinances</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/officials/residents">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-[#ea384c] mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Residents</h3>
                <p className="text-sm text-gray-600">View and manage resident information</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/officials/reports">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-[#ea384c] mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Reports</h3>
                <p className="text-sm text-gray-600">Generate and view detailed reports</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Priority Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Priority Tasks & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-800">Budget Review Due</p>
                    <p className="text-sm text-red-600">Q4 budget allocation needs approval by Dec 15</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                  Review Now
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-amber-800">Pending Service Requests</p>
                    <p className="text-sm text-amber-600">12 barangay clearance requests awaiting approval</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-100">
                  View Requests
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-800">Community Meeting</p>
                    <p className="text-sm text-blue-600">Monthly barangay assembly scheduled for tomorrow 7PM</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default OfficialsDashboard;
