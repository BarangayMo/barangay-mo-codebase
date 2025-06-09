
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { UserManagementTabs } from "@/components/users/UserManagementTabs";

const UserManagementPage = () => {
  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        <DashboardPageHeader
          title="User Management"
          description="Manage users, roles, and permissions"
          breadcrumbItems={[
            { label: "Dashboard", href: "/admin" },
            { label: "User Management" }
          ]}
        />
        
        <UserManagementTabs />
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage;
