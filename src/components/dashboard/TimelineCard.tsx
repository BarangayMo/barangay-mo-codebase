
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type OrderStatus = 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';

interface TimelineStep {
  status: OrderStatus;
  label: string;
  date?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface TimelineCardProps {
  orderId: string;
  date: string;
  steps: TimelineStep[];
  className?: string;
}

export function TimelineCard({ orderId, date, steps, className }: TimelineCardProps) {
  // Get the status badge color based on the current step
  const getStatusBadge = () => {
    const currentStep = steps.find(step => step.isCurrent);
    switch(currentStep?.status) {
      case 'processing':
        return <Badge className="bg-amber-500">Processing</Badge>;
      case 'shipping':
        return <Badge className="bg-blue-500">Shipping</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'refunded':
        return <Badge className="bg-purple-500">Refunded</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Order #{orderId}</CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground">{date}</p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 mb-4 relative">
              <div className={cn(
                "w-5 h-5 rounded-full mt-1 flex items-center justify-center",
                step.isCompleted ? "bg-primary" : "bg-gray-200",
                step.isCurrent ? "ring-2 ring-primary ring-offset-2" : ""
              )}>
                {step.isCompleted && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className={cn(
                  "font-medium",
                  step.isCurrent ? "text-primary" : ""
                )}>{step.label}</p>
                {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
