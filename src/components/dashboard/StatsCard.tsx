
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
  iconClassName
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <p className={cn("text-xs mt-2 flex items-center gap-1", 
                trend.isPositive ? "text-green-500" : "text-red-500")}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          {icon && (
            <div className={cn("p-3 rounded-full", iconClassName || "bg-primary/10")}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
