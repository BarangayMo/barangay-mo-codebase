
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";

export const OfficialStats = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
      <Card>
        <CardContent className="p-3 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Total Residents</p>
              <p className="text-lg md:text-2xl font-bold">2,847</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Active Residents</p>
              <p className="text-lg md:text-2xl font-bold">2,523</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Pending</p>
              <p className="text-lg md:text-2xl font-bold">24</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">This Month</p>
              <p className="text-lg md:text-2xl font-bold">+89</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
