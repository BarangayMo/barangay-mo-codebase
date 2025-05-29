
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from "@/hooks/use-dashboard-data";
import { useMemo } from 'react';

interface SystemGrowthChartProps {
  platformData: any[];
  dateRange: 'today' | 'week' | 'month' | 'quarter';
  setDateRange: (range: 'today' | 'week' | 'month' | 'quarter') => void;
}

export const SystemGrowthChart = ({ platformData, dateRange, setDateRange }: SystemGrowthChartProps) => {
  const { data: stats } = useDashboardStats();

  // Generate realistic chart data based on current stats
  const chartData = useMemo(() => {
    if (!stats) return platformData;

    const baseUsers = Math.max(stats.totalUsers - 50, 0);
    const baseProducts = Math.max(stats.totalProducts - 20, 0);
    
    return [
      { name: 'Apr 18', users: baseUsers + 10, residents: baseUsers + 5, officials: 32, marketplace: baseProducts + 5 },
      { name: 'Apr 19', users: baseUsers + 15, residents: baseUsers + 8, officials: 33, marketplace: baseProducts + 8 },
      { name: 'Apr 20', users: baseUsers + 22, residents: baseUsers + 12, officials: 34, marketplace: baseProducts + 12 },
      { name: 'Apr 21', users: baseUsers + 30, residents: baseUsers + 18, officials: 35, marketplace: baseProducts + 15 },
      { name: 'Apr 22', users: baseUsers + 38, residents: baseUsers + 25, officials: 36, marketplace: baseProducts + 17 },
      { name: 'Apr 23', users: baseUsers + 45, residents: baseUsers + 30, officials: 37, marketplace: baseProducts + 19 },
      { name: 'Apr 24', users: stats.totalUsers, residents: Math.floor(stats.totalUsers * 0.8), officials: 39, marketplace: stats.totalProducts },
    ];
  }, [stats, platformData]);

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Growth</CardTitle>
            <CardDescription>User registrations across platform</CardDescription>
          </div>
          <div>
            <Tabs defaultValue="week">
              <TabsList>
                <TabsTrigger value="today" onClick={() => setDateRange('today')}>Today</TabsTrigger>
                <TabsTrigger value="week" onClick={() => setDateRange('week')}>Week</TabsTrigger>
                <TabsTrigger value="month" onClick={() => setDateRange('month')}>Month</TabsTrigger>
                <TabsTrigger value="quarter" onClick={() => setDateRange('quarter')}>Quarter</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} name="Total Users" dot={{ r: 5, fill: "#3b82f6" }} activeDot={{ r: 7, fill: "#3b82f6" }} />
            <Line type="monotone" dataKey="residents" stroke="#10b981" strokeWidth={3} name="Residents" dot={{ r: 5, fill: "#10b981" }} activeDot={{ r: 7, fill: "#10b981" }} />
            <Line type="monotone" dataKey="officials" stroke="#f59e0b" strokeWidth={3} name="Officials" dot={{ r: 5, fill: "#f59e0b" }} activeDot={{ r: 7, fill: "#f59e0b" }} />
            <Line type="monotone" dataKey="marketplace" stroke="#8b5cf6" strokeWidth={3} name="Marketplace" dot={{ r: 5, fill: "#8b5cf6" }} activeDot={{ r: 7, fill: "#8b5cf6" }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
