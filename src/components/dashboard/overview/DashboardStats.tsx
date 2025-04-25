
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, BarChart, Globe, MessageSquare } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardStatsProps {
  platformData: any[];
}

export const DashboardStats = ({ platformData }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard 
        title="Total Users"
        value="1,443"
        change={{ value: 8, isPositive: true }}
        icon={<Users className="h-5 w-5 text-blue-500" />}
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={platformData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        }
      />
      <StatsCard 
        title="Marketplace Revenue"
        value="₱125,650"
        change={{ value: 12, isPositive: true }}
        icon={<BarChart className="h-5 w-5 text-green-500" />}
        iconColor="bg-green-50"
      />
      <StatsCard 
        title="Active Services"
        value="8"
        change={{ value: 2, isPositive: true }}
        icon={<Globe className="h-5 w-5 text-purple-500" />}
        iconColor="bg-purple-50"
      />
      <StatsCard 
        title="Support Tickets"
        value="24"
        change={{ value: 5, isPositive: false }}
        icon={<MessageSquare className="h-5 w-5 text-amber-500" />}
        iconColor="bg-amber-50"
      />
    </div>
  );
};
