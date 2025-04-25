
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown } from "lucide-react";

interface TopVendorsProps {
  vendorData: Array<{
    name: string;
    value: number;
    change: number;
  }>;
}

export const TopVendors = ({ vendorData }: TopVendorsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Vendors</CardTitle>
        <CardDescription>By sales volume</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={vendorData} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <XAxis type="number" axisLine={false} tickLine={false} domain={[0, 100]} hide />
            <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
            <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-3">
          {vendorData.map((vendor, index) => (
            <div key={index} className="flex justify-between items-center">
              <p className="text-sm">{vendor.name}</p>
              <div className="flex items-center">
                <span className="font-medium mr-2">{vendor.value}%</span>
                {vendor.change > 0 && (
                  <span className="text-xs text-green-600">
                    <ArrowUp className="h-3 w-3 inline" /> {vendor.change}%
                  </span>
                )}
                {vendor.change < 0 && (
                  <span className="text-xs text-red-600">
                    <ArrowDown className="h-3 w-3 inline" /> {Math.abs(vendor.change)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
