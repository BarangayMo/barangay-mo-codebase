
import { Layout } from "@/components/layout/Layout";
import { DashboardStats } from "@/components/officials/DashboardStats";
import { QuickAccessPanel } from "@/components/officials/QuickAccessPanel";
import { BudgetAllocationChart } from "@/components/officials/BudgetAllocationChart";

const OfficialsDashboard = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-red-600">
        {/* Header section can stay as is since it's handled by Layout */}
        
        {/* Content with curved top */}
        <div className="bg-gray-50 min-h-screen rounded-t-lg px-4 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Officials Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back! Here's what's happening in your barangay today.
              </p>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QuickAccessPanel />
              <BudgetAllocationChart />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfficialsDashboard;
