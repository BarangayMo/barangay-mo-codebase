
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Plus } from "lucide-react";

export const UserRolesTab = () => {
  const roles = [
    { 
      name: "Official", 
      userCount: 15, 
      color: "bg-blue-100 text-blue-800", 
      permissions: ["User management", "Content management", "Administrative access"] 
    },
    { 
      name: "Resident", 
      userCount: 125, 
      color: "bg-green-100 text-green-800", 
      permissions: ["View content", "Submit requests", "Access marketplace"] 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">User Roles</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.name} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-gray-600" />
                  {role.name}
                </CardTitle>
                <Badge className={role.color}>
                  {role.userCount} users
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
                  <div className="space-y-1">
                    {role.permissions.map((permission) => (
                      <div key={permission} className="text-sm text-gray-600">
                        • {permission}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {role.userCount} assigned
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
