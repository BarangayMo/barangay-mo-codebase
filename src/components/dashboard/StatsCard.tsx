
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  iconColor?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  chart?: ReactNode;
  className?: string;
}

export function StatsCard({ title, value, icon, iconColor = "bg-blue-50", change, chart, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {change && (
                <span className={cn(
                  "text-xs font-medium rounded-full px-1.5 py-0.5 flex items-center",
                  change.isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                )}>
                  {change.isPositive ? "↑" : "↓"} {Math.abs(change.value)}%
                </span>
              )}
            </div>
          </div>

          {icon && (
            <div className={cn("p-3 rounded-full", iconColor)}>
              {icon}
            </div>
          )}
        </div>

        {chart && (
          <div className="mt-4 h-16">
            {chart}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
