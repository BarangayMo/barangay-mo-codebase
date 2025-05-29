
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, BarChart, Globe, MessageSquare, UserPlus, Package } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export const EnhancedDashboardStats = () => {
  const { data: stats, isLoading, error } = useDashboardStats();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[140px] rounded-lg" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="text-center text-gray-500 col-span-4">
          Unable to load dashboard statistics
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div onClick={() => navigate('/admin/users/residents')} className="cursor-pointer">
        <StatsCard 
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change={{ value: stats.userGrowth, isPositive: stats.userGrowth >= 0 }}
          icon={<Users className="h-5 w-5 text-blue-500" />}
          className="transition-all hover:shadow-md"
        />
      </div>
      <div onClick={() => navigate('/admin/smarketplace/products')} className="cursor-pointer">
        <StatsCard 
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          change={{ value: stats.productGrowth, isPositive: stats.productGrowth >= 0 }}
          icon={<Package className="h-5 w-5 text-green-500" />}
          iconColor="bg-green-50"
          className="transition-all hover:shadow-md"
        />
      </div>
      <StatsCard 
        title="Membership Requests"
        value={stats.pendingMembershipRequests.toString()}
        change={{ value: stats.pendingMembershipRequests, isPositive: false }}
        icon={<UserPlus className="h-5 w-5 text-purple-500" />}
        iconColor="bg-purple-50"
      />
      <StatsCard 
        title="Support Tickets"
        value={stats.openSupportTickets.toString()}
        change={{ value: stats.openSupportTickets, isPositive: false }}
        icon={<MessageSquare className="h-5 w-5 text-amber-500" />}
        iconColor="bg-amber-50"
      />
    </div>
  );
};
