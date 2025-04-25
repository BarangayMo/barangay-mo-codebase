
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SystemGrowthChartProps {
  platformData: any[];
  dateRange: 'today' | 'week' | 'month' | 'quarter';
  setDateRange: (range: 'today' | 'week' | 'month' | 'quarter') => void;
}

export const SystemGrowthChart = ({ platformData, dateRange, setDateRange }: SystemGrowthChartProps) => {
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
          <LineChart data={platformData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Total Users" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="residents" stroke="#10b981" strokeWidth={2} name="Residents" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="officials" stroke="#f59e0b" strokeWidth={2} name="Officials" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="marketplace" stroke="#8b5cf6" strokeWidth={2} name="Marketplace" dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
