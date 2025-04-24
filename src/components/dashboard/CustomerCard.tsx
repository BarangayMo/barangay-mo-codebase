
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type CustomerStatus = 'active' | 'inactive';

interface CustomerCardProps {
  name: string;
  avatar?: string;
  email: string;
  status: CustomerStatus;
  orderCount: number;
  totalSpent: string;
  lastSeen: string;
  className?: string;
}

export function CustomerCard({ 
  name, 
  avatar, 
  email, 
  status, 
  orderCount, 
  totalSpent, 
  lastSeen, 
  className 
}: CustomerCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
          <Badge className={status === 'active' ? "bg-green-500" : "bg-gray-400"}>
            {status}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div>
            <p className="text-xs text-muted-foreground">Orders</p>
            <p className="font-medium">{orderCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="font-medium">{totalSpent}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Seen</p>
            <p className="font-medium text-xs">{lastSeen}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button className="flex-1" size="sm" variant="outline">View Profile</Button>
          <Button size="sm" variant="ghost" className="px-2">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
