
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
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";

interface EnhancedSidebarProps {
  isCollapsed?: boolean;
}

export const EnhancedSidebar = ({ isCollapsed = false }: EnhancedSidebarProps) => {
  const { openSections, toggleSection } = useSidebarState();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarMenuItems.map((item) => (
                <SidebarMenuItemBase key={item.path}>
                  <SidebarMenuItem
                    item={item}
                    isCollapsed={isCollapsed}
                    openSections={openSections}
                    onToggle={toggleSection}
                  />
                </SidebarMenuItemBase>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

