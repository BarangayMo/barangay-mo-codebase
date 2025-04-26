
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface VendorPerformanceData {
  name: string;
  [key: string]: string | number;
}

interface VendorPerformanceChartProps {
  data: VendorPerformanceData[];
}

export const VendorPerformanceChart = ({ data }: VendorPerformanceChartProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Vendor Performance (2025)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₱${value/1000}K`} />
            <Tooltip formatter={(value) => [`₱${value}`, 'Revenue']} />
            <Legend />
            <Bar dataKey="Green Farms" fill="#10b981" name="Green Farms Co-op" />
            <Bar dataKey="Local Crafts" fill="#3b82f6" name="Local Crafts Association" />
            <Bar dataKey="Tropical Treats" fill="#f59e0b" name="Tropical Treats Foods" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
