
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Infrastructure", value: 20, color: "#FF8042" },
  { name: "General Appropriations", value: 55, color: "#00C49F" },
  { name: "BDRRM", value: 5, color: "#FFBB28" },
  { name: "SK Share", value: 10, color: "#0088FE" },
  { name: "Senior & PWD Support", value: 1, color: "#FF0000" },
];

export const BudgetAllocationChart = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="p-6">
        <CardTitle>Budget Allocation</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
