
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem as SidebarMenuItemBase,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MenuItemProps {
  item: any;
  level?: number;
  isCollapsed?: boolean;
  openSections: Record<string, boolean>;
  onToggle: (sectionId: string, event: React.MouseEvent) => void;
}

export function SidebarMenuItem({ 
  item, 
  level = 0, 
  isCollapsed = false,
  openSections,
  onToggle
}: MenuItemProps) {
  const { pathname } = useLocation();
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isOpen = openSections[item.path] || false;
  const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

  if (hasSubmenu) {
    return (
      <Collapsible open={isOpen} onOpenChange={() => {}}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            onClick={(e) => onToggle(item.path, e)}
            className={cn(
              "flex w-full items-center justify-between p-2 text-sm hover:bg-gray-100 rounded-lg transition-all",
              isActive && "bg-blue-50 text-blue-600",
              isCollapsed && "px-0 justify-center"
            )}
          >
            <div className={cn(
              "flex items-center gap-3",
              isCollapsed && "justify-center"
            )}>
              {item.icon && (
                <div className={cn(
                  "relative group",
                  isCollapsed && "w-10 h-10 flex items-center justify-center"
                )}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <item.icon className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <item.icon className="h-4 w-4" />
                  )}
                </div>
              )}
              {!isCollapsed && <span className={cn(isActive && "font-medium")}>{item.title}</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "transform rotate-180"
              )} />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {!isCollapsed && (
          <CollapsibleContent className="animate-accordion-down transition-all duration-300">
            <div className={cn(
              "pl-4 border-l-2 border-gray-200 ml-2 mt-1",
              level > 0 ? "ml-3" : "ml-2"
            )}>
              <SidebarMenu>
                {item.submenu.map((subItem: any) => (
                  <SidebarMenuItemBase key={subItem.path}>
                    <SidebarMenuItem
                      item={subItem}
                      level={level + 1}
                      isCollapsed={isCollapsed}
                      openSections={openSections}
                      onToggle={onToggle}
                    />
                  </SidebarMenuItemBase>
                ))}
              </SidebarMenu>
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    );
  }

  return (
    <Link
      to={item.path}
      className={cn(
        "flex items-center gap-3 p-2 text-sm rounded-lg transition-colors relative group",
        isActive
          ? "bg-blue-50 text-blue-600 font-medium"
          : "hover:bg-gray-100",
        isCollapsed && "justify-center px-0"
      )}
    >
      {level > 0 && !isCollapsed ? (
        <div className="w-4 h-4 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
        </div>
      ) : (
        item.icon && (
          <div className={cn(
            "relative",
            isCollapsed && "w-10 h-10 flex items-center justify-center"
          )}>
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger>
                  <item.icon className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            ) : (
              <item.icon className="h-4 w-4" />
            )}
          </div>
        )
      )}
      {!isCollapsed && <span>{item.title}</span>}
    </Link>
  );
}
