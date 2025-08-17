import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail } from "lucide-react";

interface CouncilMember {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  position: string;
  barangay: string;
  municipality: string;
  province: string;
  region: string;
  phone_number: string;
  email: string;
  is_active: boolean;
}

interface BarangayCouncilTabProps {
  councilMembers: CouncilMember[];
}

export const BarangayCouncilTab = ({ councilMembers }: BarangayCouncilTabProps) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatName = (member: CouncilMember) => {
    const parts = [
      member.first_name,
      member.middle_name && member.middle_name.charAt(0) + ".",
      member.last_name,
      member.suffix
    ].filter(Boolean);
    return parts.join(" ");
  };

  if (!councilMembers || councilMembers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            No council members found for this barangay.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Council Members</h3>
        <Badge variant="outline">
          {councilMembers.length} Members
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {councilMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(member.first_name, member.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm leading-tight">
                    {formatName(member)}
                  </h4>
                  <Badge 
                    variant="secondary" 
                    className="text-xs mt-1"
                  >
                    {member.position}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span className="truncate">
                    {member.phone_number || "No phone"}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">
                    {member.email || "No email"}
                  </span>
                </div>
                
                <div className="text-xs text-muted-foreground pt-1">
                  {member.municipality}, {member.province}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};