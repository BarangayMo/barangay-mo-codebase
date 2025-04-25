
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface VendorActivityProps {
  activities: Array<{
    id: number;
    vendor: string;
    action: string;
    product: string;
    time: string;
    avatar: string;
  }>;
}

export const VendorActivity = ({ activities }: VendorActivityProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Activity</CardTitle>
        <CardDescription>Recent vendor actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={activity.avatar} />
              <AvatarFallback>{activity.vendor.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">
                <span className="font-medium">{activity.vendor}</span>
                {" "}{activity.action}{" "}
                <span className="font-medium text-primary">{activity.product}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
        <div className="pt-4 border-t text-center">
          <Button variant="outline">View All Activity</Button>
        </div>
      </CardContent>
    </Card>
  );
};
