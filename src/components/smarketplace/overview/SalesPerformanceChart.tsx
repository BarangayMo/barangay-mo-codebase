
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesPerformanceChartProps {
  salesData: Array<{
    name: string;
    sales: number;
    orders: number;
  }>;
  dateRange: 'today' | 'week' | 'month' | 'quarter';
  setDateRange: (range: 'today' | 'week' | 'month' | 'quarter') => void;
}

export const SalesPerformanceChart = ({ salesData, dateRange, setDateRange }: SalesPerformanceChartProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Revenue and orders over time</CardDescription>
          </div>
          <div>
            <Tabs defaultValue={dateRange}>
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
          <AreaChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={(value) => `₱${value/1000}K`} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#3b82f6" fill="#93c5fd" strokeWidth={2} name="Sales (₱)" />
            <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#10b981" fill="#6ee7b7" strokeWidth={2} name="Orders" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
