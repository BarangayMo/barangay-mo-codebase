
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { UserManagementTabs } from "@/components/users/UserManagementTabs";

const UserManagementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to /admin/users/all if on the base /admin/users route
  useEffect(() => {
    if (location.pathname === "/admin/users") {
      navigate("/admin/users/all", { replace: true });
    }
  }, [location.pathname, navigate]);

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
