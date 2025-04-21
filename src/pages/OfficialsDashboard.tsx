
import { Layout } from "@/components/layout/Layout";
import { DashboardStats } from "@/components/officials/DashboardStats";
import { BudgetAllocationChart } from "@/components/officials/BudgetAllocationChart";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download } from "lucide-react";

const OfficialsDashboard = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-official">Officials Dashboard</h1>
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
          <BudgetAllocationChart />
          <div className="bg-white rounded-xl border-[1.5px] border-[#ffd7da] p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
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
};

export default OfficialsDashboard;
