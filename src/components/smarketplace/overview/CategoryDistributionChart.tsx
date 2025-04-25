
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CategoryDistributionProps {
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const CategoryDistributionChart = ({ categoryData }: CategoryDistributionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>Products by category</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
