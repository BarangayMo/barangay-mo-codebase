
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: 'up' | 'down';
  trendValue: string;
}

const StatCard = ({ title, value, subtitle, trend, trendValue }: StatCardProps) => (
  <Card className="shadow-lg bg-white h-full">
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

export const DashboardStats = () => {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['official-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        // Get official's barangay
        const { data: officialProfile } = await supabase
          .from('profiles')
          .select('barangay')
          .eq('id', user.id)
          .single();

        if (!officialProfile?.barangay) return null;

        // Get residents count
        const { count: residentsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('barangay', officialProfile.barangay)
          .eq('role', 'resident');

        // Get RBI submissions count
        const { count: rbiCount } = await supabase
          .from('rbi_forms')
          .select('*', { count: 'exact', head: true })
          .eq('barangay_id', officialProfile.barangay);

        // Get pending requests count
        const { count: pendingRequests } = await supabase
          .from('complaints_requests')
          .select('*', { count: 'exact', head: true })
          .eq('barangay_id', officialProfile.barangay)
          .eq('status', 'pending');

        // Get officials count in the same barangay
        const { count: officialsCount } = await supabase
          .from('officials' as any)
          .select('*', { count: 'exact', head: true })
          .eq('barangay', officialProfile.barangay)
          .eq('status', 'active');

        return {
          residents: residentsCount || 0,
          rbiSubmissions: rbiCount || 0,
          pendingRequests: pendingRequests || 0,
          officials: officialsCount || 0
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
          residents: 0,
          rbiSubmissions: 0,
          pendingRequests: 0,
          officials: 0
        };
      }
    },
    enabled: !!user?.id
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
      <StatCard
        title="Total Residents"
        value={stats?.residents?.toString() || "0"}
        subtitle="registered residents"
        trend="up"
        trendValue="+2"
      />
      <StatCard
        title="Active Officials"
        value={stats?.officials?.toString() || "0"}
        subtitle="barangay officials"
        trend="up"
        trendValue="+1"
      />
      <StatCard
        title="RBI Submissions"
        value={stats?.rbiSubmissions?.toString() || "0"}
        subtitle="completed forms"
        trend="up"
        trendValue="+5"
      />
      <StatCard
        title="Pending Requests"
        value={stats?.pendingRequests?.toString() || "0"}
        subtitle="need action"
        trend="down"
        trendValue="-3"
      />
    </div>
  );
};
