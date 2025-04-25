
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UserDistributionProps {
  userDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const UserDistributionChart = ({ userDistribution }: UserDistributionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>By user type</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-3">
          {userDistribution.map((type, index) => (
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
