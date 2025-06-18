
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BudgetOverview = () => {
  const { data: budgetData } = useQuery({
    queryKey: ['budget-allocations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budget_allocations')
        .select('*')
        .order('allocated_amount', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const pieData = budgetData?.map((item, index) => ({
    name: item.category,
    value: Number(item.allocated_amount),
    spent: Number(item.spent_amount),
    color: ['#ea384c', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'][index % 6]
  })) || [];

  const barData = budgetData?.map(item => ({
    category: item.category.split(' ')[0], // Shorten category names
    allocated: Number(item.allocated_amount),
    spent: Number(item.spent_amount),
    remaining: Number(item.allocated_amount) - Number(item.spent_amount)
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Budget Allocation & Spending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-4">Budget Distribution</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ₱${(value/1000).toFixed(0)}K`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Allocated']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-4">Spending vs Allocation</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => [`₱${value.toLocaleString()}`, '']}
                  />
                  <Bar dataKey="allocated" fill="#ea384c" name="Allocated" />
                  <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Budget Summary Table */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Detailed Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Category</th>
                  <th className="text-right py-2">Allocated</th>
                  <th className="text-right py-2">Spent</th>
                  <th className="text-right py-2">Remaining</th>
                  <th className="text-right py-2">Usage %</th>
                </tr>
              </thead>
              <tbody>
                {budgetData?.map((item, index) => {
                  const spent = Number(item.spent_amount);
                  const allocated = Number(item.allocated_amount);
                  const remaining = allocated - spent;
                  const percentage = (spent / allocated) * 100;

                  return (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-medium">{item.category}</td>
                      <td className="text-right py-2">₱{allocated.toLocaleString()}</td>
                      <td className="text-right py-2">₱{spent.toLocaleString()}</td>
                      <td className="text-right py-2">₱{remaining.toLocaleString()}</td>
                      <td className="text-right py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          percentage > 80 ? 'bg-red-100 text-red-700' :
                          percentage > 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
