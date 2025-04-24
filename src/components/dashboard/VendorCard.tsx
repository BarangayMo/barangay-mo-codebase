
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export type VendorStatus = 'active' | 'pending' | 'suspended';

interface VendorCardProps {
  name: string;
  avatar?: string;
  status: VendorStatus;
  productCount: number;
  revenue: string;
  joinDate: string;
  className?: string;
}

export function VendorCard({ name, avatar, status, productCount, revenue, joinDate, className }: VendorCardProps) {
  const getStatusBadge = () => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500">Suspended</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-xs text-muted-foreground">Since {joinDate}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-muted-foreground">Products</p>
            <p className="font-medium">{productCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="font-medium">{revenue}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button className="flex-1" size="sm" variant="outline">View Profile</Button>
          <Button size="sm" variant="ghost" className="px-2">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="px-2">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
