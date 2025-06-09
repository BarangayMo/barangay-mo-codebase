
import { useState } from "react";
import { ModernTabs } from "@/components/dashboard/ModernTabs";
import { TabsContent } from "@/components/ui/tabs";
import { AllUsersTab } from "./AllUsersTab";
import { UserRolesTab } from "./UserRolesTab";
import { UserSettingsTab } from "./UserSettingsTab";
import { Users, Shield, Settings } from "lucide-react";

export const UserManagementTabs = () => {
  const tabItems = [
    { value: "all-users", label: "All Users", icon: <Users className="h-4 w-4" /> },
    { value: "user-roles", label: "User Roles", icon: <Shield className="h-4 w-4" /> },
    { value: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <ModernTabs defaultValue="all-users" items={tabItems}>
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
