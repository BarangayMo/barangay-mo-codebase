
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
  const { openSections, toggleSection, activeSection, setActiveSection } = useSidebarState();

  // Transform menu items to the expected format for SidebarMenuItem
  const transformMenuItem = (item: any) => ({
    path: item.href || item.path || '#',
    title: item.label,
    icon: item.icon,
    submenu: item.children ? item.children.map(transformMenuItem) : undefined
  });

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        <SidebarContent className={isCollapsed ? "px-0" : "px-2 py-2"}>
          <SidebarGroup className="mb-4">
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarMenuItems.map((item, index) => (
                  <SidebarMenuItemBase key={index}>
                    <SidebarMenuItem
                      item={transformMenuItem(item)}
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
        </SidebarContent>
      </div>
    </div>
  );
};
