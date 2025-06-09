
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Plus, Loader2 } from "lucide-react";
import { useRoleSettings } from "@/hooks/use-role-settings";

export const UserRolesTab = () => {
  const { data: roleSettings = [], isLoading, error } = useRoleSettings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        Error loading role settings. Please try again.
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'official':
        return 'bg-blue-100 text-blue-800';
      case 'resident':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'official':
        return 'Official';
      case 'resident':
        return 'Resident';
      default:
        return role;
    }
  };

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
        {roleSettings.map((roleSetting) => (
          <Card key={roleSetting.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-gray-600" />
                  {getRoleDisplayName(roleSetting.role)}
                </CardTitle>
                <Badge className={getRoleColor(roleSetting.role)}>
                  {roleSetting.user_count} users
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
                  <div className="space-y-1">
                    {roleSetting.permissions.map((permission, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {permission}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {roleSetting.user_count} assigned
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
