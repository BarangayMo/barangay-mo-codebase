
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Users, Calendar, DollarSign, Clock } from "lucide-react";

export const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "document",
      title: "Barangay Ordinance 2024-05 Approved",
      description: "New ordinance on waste management approved by council",
      time: "2 hours ago",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 2,
      type: "budget",
      title: "Infrastructure Budget Updated",
      description: "₱125,000 allocated for road improvement project",
      time: "4 hours ago",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: 3,
      type: "event",
      title: "Community Health Fair Scheduled",
      description: "Free medical checkup event scheduled for next week",
      time: "6 hours ago",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: 4,
      type: "resident",
      title: "New Resident Registration",
      description: "15 new residents registered this week",
      time: "1 day ago",
      icon: Users,
      color: "text-[#ea384c]",
      bgColor: "bg-red-50"
    },
    {
      id: 5,
      type: "document",
      title: "Monthly Report Generated",
      description: "October monthly report now available for review",
      time: "2 days ago",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full ${activity.bgColor}`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 mb-1">
                  {activity.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <button className="text-sm text-[#ea384c] hover:text-[#d12d41] font-medium">
            View All Activity →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
