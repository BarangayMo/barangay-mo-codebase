
import { Layout } from "@/components/layout/Layout";
import { DashboardStats } from "@/components/officials/DashboardStats";
import { BudgetAllocationChart } from "@/components/officials/BudgetAllocationChart";
import { QuickAccessPanel } from "@/components/officials/QuickAccessPanel";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Helmet } from "react-helmet";

const OfficialsDashboard = () => {
  return (
    <Layout>
      <Helmet>
        <title>Officials Dashboard - Barangay Management System</title>
      </Helmet>
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Profile Card */}
          <Card className="bg-gradient-to-r from-[#ff6b6b] to-[#ff8787] text-white shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 sm:border-4 border-white/20">
                  <AvatarImage src="/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" />
                  <AvatarFallback>BM</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold font-outfit truncate">Juan Dela Cruz</h2>
                  <p className="text-white/90 text-sm sm:text-base">Barangay Captain</p>
                  <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2 mt-1 sm:mt-2">
                    <div>
                      <p className="text-xs sm:text-sm text-white/80">Ward</p>
                      <p className="font-semibold text-sm sm:text-base">Ward 7</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-white/80">ID Number</p>
                      <p className="font-semibold text-sm sm:text-base">#123456</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-official font-outfit">Officials Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Welcome back, Barangay Official</p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1 sm:flex-initial text-xs sm:text-sm">
                <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Filter by Date</span>
                <span className="xs:hidden">Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1 sm:flex-initial text-xs sm:text-sm">
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Export Report</span>
                <span className="xs:hidden">Export</span>
              </Button>
            </div>
          </div>

          {/* Dashboard Stats */}
          <DashboardStats />

          {/* Mobile Quick Access Panel - Only show on mobile */}
          <div className="block lg:hidden">
            <QuickAccessPanel />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Budget Chart */}
            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 font-outfit">Budget Allocation</h3>
                <BudgetAllocationChart />
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card className="border-[1.5px] border-[#ffd7da] shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 font-outfit">Quick Actions</h3>
                <div className="space-y-2 sm:space-y-3">
                  <Button variant="outline" className="w-full justify-start text-sm">Review Pending Requests</Button>
                  <Button variant="outline" className="w-full justify-start text-sm">Manage Resident Database</Button>
                  <Button variant="outline" className="w-full justify-start text-sm">Create Announcement</Button>
                  <Button variant="outline" className="w-full justify-start text-sm">Generate Reports</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OfficialsDashboard;
