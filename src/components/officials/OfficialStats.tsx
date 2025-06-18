
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, TrendingUp, DollarSign, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const OfficialStats = () => {
  const { data: budgetData } = useQuery({
    queryKey: ['budget-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budget_allocations')
        .select('allocated_amount, spent_amount');
      
      if (error) throw error;
      
      const totalAllocated = data?.reduce((sum, item) => sum + Number(item.allocated_amount), 0) || 0;
      const totalSpent = data?.reduce((sum, item) => sum + Number(item.spent_amount), 0) || 0;
      
      return { totalAllocated, totalSpent };
    },
  });

  const { data: eventsCount } = useQuery({
    queryKey: ['events-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('community_events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'planned');
      
      return count || 0;
    },
  });

  const { data: campaignsCount } = useQuery({
    queryKey: ['campaigns-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_progress');
      
      return count || 0;
    },
  });

  const stats = [
    {
      title: "Total Budget",
      value: `₱${budgetData?.totalAllocated?.toLocaleString() || '0'}`,
      subtitle: "Allocated this year",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+12.5%",
      trendUp: true
    },
    {
      title: "Budget Spent",
      value: `₱${budgetData?.totalSpent?.toLocaleString() || '0'}`,
      subtitle: `${budgetData ? Math.round((budgetData.totalSpent / budgetData.totalAllocated) * 100) : 0}% utilized`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+8.2%",
      trendUp: true
    },
    {
      title: "Active Campaigns",
      value: campaignsCount?.toString() || "0",
      subtitle: "Currently running",
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "+3",
      trendUp: true
    },
    {
      title: "Upcoming Events",
      value: eventsCount?.toString() || "0",
      subtitle: "This month",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "+5",
      trendUp: true
    },
    {
      title: "Registered Residents",
      value: "2,847",
      subtitle: "Active residents",
      icon: Users,
      color: "text-[#ea384c]",
      bgColor: "bg-red-50",
      trend: "+24",
      trendUp: true
    },
    {
      title: "Documents Issued",
      value: "156",
      subtitle: "This month",
      icon: FileText,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      trend: "+18%",
      trendUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
