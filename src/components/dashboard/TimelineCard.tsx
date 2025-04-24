
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Clock, Package, Truck } from "lucide-react";

export type OrderStatus = 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';

export interface TimelineStep {
  status: OrderStatus;
  label: string;
  date: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface TimelineProps {
  orderId: string;
  date: string;
  steps: TimelineStep[];
}

export const TimelineCard = ({ orderId, date, steps }: TimelineProps) => {
  const getStepIcon = (status: OrderStatus) => {
    switch(status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'shipping':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{orderId}</CardTitle>
        <p className="text-xs text-muted-foreground">{date}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                step.isCurrent ? "bg-primary ring-2 ring-primary ring-offset-2" : 
                  step.isCompleted ? "bg-green-100" : "bg-gray-100"
              )}>
                {step.isCompleted ? 
                  <Check className="h-4 w-4 text-green-600" /> : 
                  getStepIcon(step.status)
                }
              </div>
              <div className="text-xs font-medium mt-1 text-center">{step.label}</div>
              <div className="text-[10px] text-muted-foreground">{step.date}</div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 justify-between">
          <div className="w-full h-1 bg-gray-100 relative">
            {steps.map((step, index) => {
              const width = 100 / (steps.length - 1) * index;
              return step.isCompleted && (
                <div 
                  key={index}
                  className="absolute top-0 h-1 bg-green-500 transition-all"
                  style={{ width: `${width}%` }}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
