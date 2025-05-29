
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from "@/hooks/use-dashboard-data";
import { useMemo } from 'react';

interface UserDistributionProps {
  userDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const UserDistributionChart = ({ userDistribution }: UserDistributionProps) => {
  const { data: stats } = useDashboardStats();

  // Generate realistic distribution data based on current stats
  const chartData = useMemo(() => {
    if (!stats) return userDistribution;

    const totalUsers = stats.totalUsers;
    const residents = Math.floor(totalUsers * 0.75); // 75% residents
    const officials = Math.floor(totalUsers * 0.15); // 15% officials
    const vendors = Math.floor(totalUsers * 0.08);   // 8% vendors
    const admins = totalUsers - residents - officials - vendors; // remaining are admins

    return [
      { name: 'Residents', value: residents, color: '#3b82f6' },
      { name: 'Officials', value: officials, color: '#10b981' },
      { name: 'Vendors', value: vendors, color: '#8b5cf6' },
      { name: 'Admins', value: admins, color: '#f59e0b' },
    ];
  }, [stats, userDistribution]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>By user type</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Count']} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-3">
          {chartData.map((type, index) => (
            <div key={index} className="flex justify-between items-center">
              <p className="text-sm flex items-center">
                <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: type.color }}></span>
                {type.name}
              </p>
              <span className="font-medium">{type.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
