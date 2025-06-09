
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { AllUsersTab } from "@/components/users/AllUsersTab";
import { UserRolesTab } from "@/components/users/UserRolesTab";
import { UserSettingsTab } from "@/components/users/UserSettingsTab";

const UserManagementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to /admin/users/all if on the base /admin/users route
  useEffect(() => {
    if (location.pathname === "/admin/users") {
      navigate("/admin/users/all", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Determine which content to show based on route
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === "/admin/users/roles") {
      return <UserRolesTab />;
    } else if (path === "/admin/users/settings") {
      return <UserSettingsTab />;
    } else {
      // Default to All Users for /admin/users/all and fallback
      return <AllUsersTab />;
    }
  };

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === "/admin/users/roles") {
      return "User Roles";
    } else if (path === "/admin/users/settings") {
      return "User Settings";
    } else {
      return "All Users";
    }
  };

  // Get breadcrumb items based on route
  const getBreadcrumbItems = () => {
    const path = location.pathname;
    
    if (path === "/admin/users/roles") {
      return [
        { label: "Dashboard", href: "/admin" },
        { label: "Users", href: "/admin/users/all" },
        { label: "User Roles" }
      ];
    } else if (path === "/admin/users/settings") {
      return [
        { label: "Dashboard", href: "/admin" },
        { label: "Users", href: "/admin/users/all" },
        { label: "Settings" }
      ];
    } else {
      return [
        { label: "Dashboard", href: "/admin" },
        { label: "Users", href: "/admin/users/all" },
        { label: "All Users" }
      ];
    }
  };

  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        <DashboardPageHeader
          title={getPageTitle()}
          description="Manage users, roles, and permissions"
          breadcrumbItems={getBreadcrumbItems()}
        />
        
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage;
