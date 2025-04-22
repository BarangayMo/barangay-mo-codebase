
import { Layout } from "@/components/layout/Layout";
import { DashboardStats } from "@/components/officials/DashboardStats";
import { BudgetAllocationChart } from "@/components/officials/BudgetAllocationChart";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const OfficialsDashboard = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-4 px-4">
        <Card className="mb-6 bg-gradient-to-r from-[#ff6b6b] to-[#ff8787] text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white">
                <AvatarImage src="/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" />
                <AvatarFallback>BM</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold font-outfit">Juan Dela Cruz</h2>
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
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-official font-outfit">Officials Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, Barangay Official</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Filter by Date
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <DashboardStats />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[300px]">
              <BudgetAllocationChart />
            </div>
          </div>
          <div className="bg-white rounded-xl border-[1.5px] border-[#ffd7da] p-6">
            <h3 className="text-lg font-semibold mb-4 font-outfit">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">Review Pending Requests</Button>
              <Button variant="outline" className="w-full justify-start">Manage Resident Database</Button>
              <Button variant="outline" className="w-full justify-start">Create Announcement</Button>
              <Button variant="outline" className="w-full justify-start">Generate Reports</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OfficialsDashboard;
