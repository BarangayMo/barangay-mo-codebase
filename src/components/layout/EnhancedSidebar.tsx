
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem as SidebarMenuItemBase,
} from "@/components/ui/sidebar";
import { sidebarMenuItems } from "@/config/sidebar-menu";
import { officialSidebarMenuItems } from "@/config/official-sidebar-menu";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { useAuth } from "@/contexts/AuthContext";

interface EnhancedSidebarProps {
  isCollapsed?: boolean;
}

export const EnhancedSidebar = ({ isCollapsed = false }: EnhancedSidebarProps) => {
  const { openSections, toggleSection, activeSection, setActiveSection } = useSidebarState();
  const { userRole } = useAuth();
  
  // Use official sidebar menu for officials, admin menu for others
  const menuItems = userRole === "official" ? officialSidebarMenuItems : sidebarMenuItems;

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        <SidebarContent className={isCollapsed ? "px-0" : "px-2 py-2"}>
          {menuItems.map((group, index) => (
            <SidebarGroup key={index} className="mb-4">
              {!isCollapsed && group.groupLabel && (
                <SidebarGroupLabel className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.groupLabel}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItemBase key={item.path}>
                      <SidebarMenuItem
                        item={item}
                        isCollapsed={isCollapsed}
                        openSections={openSections}
                        onToggle={toggleSection}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                      />
                    </SidebarMenuItemBase>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </div>
    </div>
  );
};
