
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCheck, CheckCircle, X, Eye } from "lucide-react";
import { useState } from "react";

interface PendingResident {
  id: number;
  name: string;
  email: string;
  requestDate: string;
  barangay: string;
  phone?: string;
  address?: string;
}

interface ResidentApprovalCardProps {
  pendingResidents: PendingResident[];
}

export const ResidentApprovalCard = ({ pendingResidents }: ResidentApprovalCardProps) => {
  const [residents, setResidents] = useState(pendingResidents);

  const handleApprove = (id: number) => {
    setResidents(prev => prev.filter(r => r.id !== id));
    // Here you would make an API call to approve the resident
    console.log(`Approved resident with id: ${id}`);
  };

  const handleReject = (id: number) => {
    setResidents(prev => prev.filter(r => r.id !== id));
    // Here you would make an API call to reject the resident
    console.log(`Rejected resident with id: ${id}`);
  };

  if (residents.length === 0) {
    return (
      <Card className="mb-4 md:mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
            Resident Approvals
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              All Clear
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <UserCheck className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No pending resident approvals</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 md:mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
          Pending Resident Approvals
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
            {residents.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {residents.map((resident) => (
            <div key={resident.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200 gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                  <AvatarFallback className="text-xs bg-orange-100 text-orange-700">
                    {resident.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-orange-800 text-sm md:text-base">{resident.name}</p>
                  <p className="text-xs md:text-sm text-orange-600">{resident.email}</p>
                  <p className="text-xs text-orange-500">Requested: {resident.requestDate}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-xs"
                  onClick={() => handleApprove(resident.id)}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-red-200 text-red-700 hover:bg-red-50 text-xs"
                  onClick={() => handleReject(resident.id)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Reject
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-orange-200 text-orange-700 hover:bg-orange-100 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
