
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, UserCheck, Settings } from "lucide-react";

const UserRolesPage = () => {
  const roles = [
    {
      id: "superadmin",
      name: "Super Admin",
      description: "Full system access with all administrative privileges",
      userCount: 2,
      permissions: ["Full Access", "User Management", "System Settings", "Data Export"],
      color: "bg-red-100 text-red-800"
    },
    {
      id: "admin",
      name: "Admin",
      description: "Administrative access with most privileges",
      userCount: 5,
      permissions: ["User Management", "Content Management", "Reports", "Settings"],
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: "official",
      name: "Official",
      description: "Barangay officials with elevated permissions",
      userCount: 28,
      permissions: ["Dashboard Access", "Resident Management", "Document Generation"],
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: "resident",
      name: "Resident",
      description: "Standard user access for barangay residents",
      userCount: 1249,
      permissions: ["Profile Management", "Service Requests", "Marketplace Access"],
      color: "bg-green-100 text-green-800"
    }
  ];

  return (
    <AdminLayout title="User Roles">
      <DashboardPageHeader
        title="User Roles"
        description="Manage user roles and permissions"
        breadcrumbItems={[
          { label: "Users", href: "/admin/users" },
          { label: "User Roles" }
        ]}
        actionButton={{
          label: "Create Role",
          onClick: () => console.log("Create role"),
          icon: <Shield className="h-4 w-4" />,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Shield className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{role.userCount} users</span>
                    </div>
                  </div>
                </div>
                <Badge className={role.color}>
                  {role.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{role.description}</p>
              
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-gray-700">Key Permissions:</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Role
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={role.color}>
                    {role.name}
                  </Badge>
                  <span className="text-sm text-gray-600">{role.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{role.userCount}</span>
                  <span className="text-xs text-gray-500">users</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default UserRolesPage;
