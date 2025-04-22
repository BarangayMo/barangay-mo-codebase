
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <StatCard
        title="Total Budget"
        value="₱5,240,000"
        subtitle="vs last month"
        trend="up"
        trendValue="+14.2%"
      />
      <StatCard
        title="Remaining Budget"
        value="₱3,180,500"
        subtitle="of annual budget"
        trend="down"
        trendValue="60.7%"
      />
      <StatCard
        title="Pending Requests"
        value="24"
        subtitle="need action"
        trend="up"
        trendValue="+8"
      />
    </div>
  );
};
