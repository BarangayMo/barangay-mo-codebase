
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CreditCard, Package, Users, ShoppingBag } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface MarketplaceStatsProps {
  salesData: Array<{
    name: string;
    sales: number;
    orders: number;
  }>;
}

export const MarketplaceStats = ({ salesData }: MarketplaceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
      <StatsCard 
        title="Total Orders"
        value="324"
        change={{ value: 8, isPositive: true }}
        icon={<Package className="h-5 w-5 text-green-500" />}
        iconColor="bg-green-50"
      />
      <StatsCard 
        title="Active Vendors"
        value="58"
        change={{ value: 3, isPositive: true }}
        icon={<Users className="h-5 w-5 text-purple-500" />}
        iconColor="bg-purple-50"
      />
      <StatsCard 
        title="Active Listings"
        value="1,246"
        change={{ value: 15, isPositive: true }}
        icon={<ShoppingBag className="h-5 w-5 text-amber-500" />}
        iconColor="bg-amber-50"
      />
    </div>
  );
};
