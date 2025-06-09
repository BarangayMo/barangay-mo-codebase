
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ModernTabs } from "@/components/dashboard/ModernTabs";
import { TabsContent } from "@/components/ui/tabs";
import { AllUsersTab } from "./AllUsersTab";
import { UserRolesTab } from "./UserRolesTab";
import { UserSettingsTab } from "./UserSettingsTab";
import { Users, Shield, Settings } from "lucide-react";

export const UserManagementTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all-users");

  const tabItems = [
    { value: "all-users", label: "All Users", icon: <Users className="h-4 w-4" /> },
    { value: "user-roles", label: "User Roles", icon: <Shield className="h-4 w-4" /> },
    { value: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  // Handle route-based tab selection
  useEffect(() => {
    const path = location.pathname;
    if (path === "/admin/users/roles") {
      setActiveTab("user-roles");
    } else if (path === "/admin/users/settings") {
      setActiveTab("settings");
    } else {
      setActiveTab("all-users");
    }
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    switch (value) {
      case "all-users":
        navigate("/admin/users/all");
        break;
      case "user-roles":
        navigate("/admin/users/roles");
        break;
      case "settings":
        navigate("/admin/users/settings");
        break;
      default:
        navigate("/admin/users/all");
    }
  };

  return (
    <ModernTabs 
      defaultValue={activeTab} 
      items={tabItems}
      onValueChange={handleTabChange}
    >
      <TabsContent value="all-users">
        <AllUsersTab />
      </TabsContent>
      
      <TabsContent value="user-roles">
        <UserRolesTab />
      </TabsContent>
      
      <TabsContent value="settings">
        <UserSettingsTab />
      </TabsContent>
    </ModernTabs>
  );
};
