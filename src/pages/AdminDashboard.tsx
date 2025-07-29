
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { EnhancedDashboardStats } from "@/components/dashboard/overview/EnhancedDashboardStats";
import { SystemGrowthChart } from "@/components/dashboard/overview/SystemGrowthChart";
import { UserDistributionChart } from "@/components/dashboard/overview/UserDistributionChart";
import { ModernTabs } from "@/components/dashboard/ModernTabs";
import { LatestUsersTab } from "@/components/dashboard/tabs/LatestUsersTab";
import { LatestProductsTab } from "@/components/dashboard/tabs/LatestProductsTab";
import { MembershipRequestsTab } from "@/components/dashboard/tabs/MembershipRequestsTab";
import { SupportTicketsTab } from "@/components/dashboard/tabs/SupportTicketsTab";
import { RbiFormsTab } from "@/components/dashboard/tabs/RbiFormsTab";
import { TabsContent } from "@/components/ui/tabs";
import { useMediaLibrary } from "@/hooks";
import { 
  BarChart, 
  Users, 
  Package, 
  UserPlus, 
  MessageSquare,
  FileText
} from "lucide-react";

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter'>('week');
  
  // Preload media library data for faster access when user opens media library
  const { mediaFiles, loadingFiles } = useMediaLibrary({
    user: null,
    category: null, 
    startDate: null,
    endDate: null
  }, "");
  
  // Platform-wide data (not just marketplace)
  const platformData = [
    { name: 'Apr 18', users: 125, residents: 85, officials: 32, marketplace: 18 },
    { name: 'Apr 19', users: 132, residents: 92, officials: 32, marketplace: 22 },
    { name: 'Apr 20', users: 141, residents: 99, officials: 33, marketplace: 25 },
    { name: 'Apr 21', users: 152, residents: 105, officials: 35, marketplace: 28 },
    { name: 'Apr 22', users: 164, residents: 112, officials: 35, marketplace: 32 },
    { name: 'Apr 23', users: 182, residents: 125, officials: 37, marketplace: 35 },
    { name: 'Apr 24', users: 204, residents: 140, officials: 39, marketplace: 40 },
  ];
  
  // User distribution data
  const userDistribution = [
    { name: 'Residents', value: 1249, color: '#3b82f6' },
    { name: 'Officials', value: 124, color: '#10b981' },
    { name: 'Vendors', value: 58, color: '#8b5cf6' },
    { name: 'Admins', value: 12, color: '#f59e0b' },
  ];

  const tabItems = [
    { value: "overview", label: "Overview", icon: <BarChart className="h-4 w-4" /> },
    { value: "users", label: "Latest Users", icon: <Users className="h-4 w-4" /> },
    { value: "products", label: "Latest Products", icon: <Package className="h-4 w-4" /> },
    { value: "rbi", label: "RBI Forms", icon: <FileText className="h-4 w-4" /> },
    { value: "membership", label: "Membership Requests", icon: <UserPlus className="h-4 w-4" /> },
    { value: "support", label: "Support Tickets", icon: <MessageSquare className="h-4 w-4" /> },
  ];

  console.log(`Preloading media library data: ${loadingFiles ? 'Loading...' : `${mediaFiles?.length || 0} files loaded`}`);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <DashboardPageHeader
          title="BarangayMo Administrative Dashboard"
          description="Overview of your platform's performance and activities"
          breadcrumbItems={[{ label: "Dashboard" }]}
        />

        <EnhancedDashboardStats />

        <ModernTabs defaultValue="overview" items={tabItems}>
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <SystemGrowthChart 
                platformData={platformData}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
              <UserDistributionChart userDistribution={userDistribution} />
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <LatestUsersTab />
          </TabsContent>
          
          <TabsContent value="products">
            <LatestProductsTab />
          </TabsContent>
          
          <TabsContent value="rbi">
            <RbiFormsTab />
          </TabsContent>
          
          <TabsContent value="membership">
            <MembershipRequestsTab />
          </TabsContent>
          
          <TabsContent value="support">
            <SupportTicketsTab />
          </TabsContent>
        </ModernTabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
