
import { CreditCard } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface RevenueStatsProps {
  salesData: Array<{
    name: string;
    sales: number;
    orders: number;
  }>;
}

export const RevenueStats = ({ salesData }: RevenueStatsProps) => {
  return (
    <StatsCard 
      title="Total Revenue"
      value="₱125,650"
      change={{ value: 12, isPositive: true }}
      icon={<CreditCard className="h-5 w-5 text-blue-500" />}
      chart={
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      }
    />
  );
};
