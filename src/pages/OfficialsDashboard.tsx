
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
  DollarSign, 
  Settings,
  Plus,
  BarChart3,
  AlertTriangle,
  Clock,
  Bell,
  Target,
  CheckCircle,
  UserCheck
} from "lucide-react";
import { OfficialStats } from "@/components/officials/OfficialStats";
import { BudgetOverview } from "@/components/officials/BudgetOverview";
import { RecentActivity } from "@/components/officials/RecentActivity";
import { UpcomingEvents } from "@/components/officials/UpcomingEvents";
import { CampaignMetrics } from "@/components/officials/CampaignMetrics";

const OfficialsDashboard = () => {
  // Mock pending resident registrations
  const pendingResidents = [
    {
      id: 1,
      name: "Maria Santos",
      email: "maria.santos@email.com",
      requestDate: "Dec 15, 2024",
      barangay: "Barangay San Jose"
    },
    {
      id: 2,
      name: "Juan Dela Cruz", 
      email: "juan.delacruz@email.com",
      requestDate: "Dec 14, 2024",
      barangay: "Barangay San Jose"
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Officials Dashboard - BarangayMo</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto py-3 md:py-6 px-3 md:px-6">
        {/* Mobile-Optimized Header Section */}
        <div className="grid gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-gradient-to-r from-[#ea384c] to-[#ff6b78] text-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <Avatar className="h-12 w-12 md:h-16 md:w-16 border-2 md:border-4 border-white/20 mx-auto md:mx-0">
                  <AvatarImage src="/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" />
                  <AvatarFallback>BC</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-lg md:text-xl font-bold">Juan Dela Cruz</h2>
                  <p className="text-white/90 text-sm md:text-base">Barangay Captain</p>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
                    <div className="text-center md:text-left">
                      <p className="text-xs text-white/80">Ward</p>
                      <p className="font-semibold text-sm">Ward 7</p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs text-white/80">ID Number</p>
                      <p className="font-semibold text-sm">#123456</p>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs mx-auto md:mx-0">
                      Active Term
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-center md:justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10 bg-white/10"
                  >
                    <Settings className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    <span className="text-xs md:text-sm">Profile Settings</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile-Optimized Page Header */}
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-3xl font-bold text-[#ea384c]">Officials Dashboard</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Manage your barangay operations and connect with your community</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <Button asChild className="bg-[#ea384c] hover:bg-[#d12d41] text-sm">
                <Link to="/officials/campaigns/new">
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  New Campaign
                </Link>
              </Button>
              <Button variant="outline" asChild className="text-sm">
                <Link to="/officials/events/new">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Schedule Event
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Pending Resident Approvals - Mobile First */}
        <Card className="mb-4 md:mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
              Pending Resident Approvals
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                {pendingResidents.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingResidents.map((resident) => (
                <div key={resident.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200 gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarFallback className="text-xs">{resident.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-orange-800 text-sm md:text-base">{resident.name}</p>
                      <p className="text-xs md:text-sm text-orange-600">{resident.email}</p>
                      <p className="text-xs text-orange-500">{resident.requestDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-100 text-xs">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards - Mobile Grid */}
        <OfficialStats />

        {/* Main Content - Mobile Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Budget Overview */}
          <div className="lg:col-span-2">
            <BudgetOverview />
          </div>
          
          {/* Campaign Metrics */}
          <div>
            <CampaignMetrics />
          </div>
        </div>

        {/* Secondary Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Recent Activity */}
          <RecentActivity />
          
          {/* Upcoming Events */}
          <UpcomingEvents />
        </div>

        {/* Quick Actions Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/officials/budget">
              <CardContent className="p-3 md:p-6 text-center">
                <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-[#ea384c] mx-auto mb-2 md:mb-3" />
                <h3 className="font-semibold text-xs md:text-sm mb-1 md:mb-2">Budget</h3>
                <p className="text-xs text-gray-600 hidden md:block">Track budget allocations</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/officials/documents">
              <CardContent className="p-3 md:p-6 text-center">
                <FileText className="h-6 w-6 md:h-8 md:w-8 text-[#ea384c] mx-auto mb-2 md:mb-3" />
                <h3 className="font-semibold text-xs md:text-sm mb-1 md:mb-2">Documents</h3>
                <p className="text-xs text-gray-600 hidden md:block">Manage documents</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/officials/residents">
              <CardContent className="p-3 md:p-6 text-center">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-[#ea384c] mx-auto mb-2 md:mb-3" />
                <h3 className="font-semibold text-xs md:text-sm mb-1 md:mb-2">Residents</h3>
                <p className="text-xs text-gray-600 hidden md:block">Manage residents</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/officials/reports">
              <CardContent className="p-3 md:p-6 text-center">
                <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-[#ea384c] mx-auto mb-2 md:mb-3" />
                <h3 className="font-semibold text-xs md:text-sm mb-1 md:mb-2">Reports</h3>
                <p className="text-xs text-gray-600 hidden md:block">Generate reports</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Priority Tasks - Mobile Optimized */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
              Priority Tasks & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-red-50 rounded-lg border border-red-200 gap-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800 text-sm md:text-base">Budget Review Due</p>
                    <p className="text-xs md:text-sm text-red-600">Q4 budget allocation needs approval by Dec 15</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-100 text-xs">
                  Review Now
                </Button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-amber-50 rounded-lg border border-amber-200 gap-3">
                <div className="flex items-start gap-3">
                  <Bell className="h-4 w-4 md:h-5 md:w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 text-sm md:text-base">Pending Service Requests</p>
                    <p className="text-xs md:text-sm text-amber-600">12 barangay clearance requests awaiting approval</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-100 text-xs">
                  View Requests
                </Button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200 gap-3">
                <div className="flex items-start gap-3">
                  <Target className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800 text-sm md:text-base">Community Meeting</p>
                    <p className="text-xs md:text-sm text-blue-600">Monthly barangay assembly scheduled for tomorrow 7PM</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100 text-xs">
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
