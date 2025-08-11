
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem as SidebarMenuItemBase,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface MenuItemProps {
  item: any;
  level?: number;
  isCollapsed?: boolean;
  openSections: Record<string, boolean>;
  onToggle: (sectionId: string, event?: React.MouseEvent) => void;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function SidebarMenuItem({ 
  item, 
  level = 0, 
  isCollapsed = false,
  openSections,
  onToggle,
  activeSection,
  setActiveSection
}: MenuItemProps) {
  const { pathname } = useLocation();
  const { userRole } = useAuth();
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isOpen = openSections[item.path] || false;
  const isActive =
  item.path === "/admin"
    ? pathname === "/admin"
    : pathname === item.path || pathname.startsWith(`${item.path}/`);

  // Enhanced colors with higher specificity for officials
  const getActiveColors = () => {
    if (userRole === "official") {
      return "!bg-red-50 !text-red-600 !font-medium border-l-2 !border-red-500";
    }
    return "bg-blue-50 text-blue-600 font-medium";
  };

  const getOpenColors = () => {
    if (userRole === "official") {
      return "!bg-red-50 !text-red-600 !font-medium";
    }
    return "bg-gray-100 font-medium";
  };

  const getHoverColors = () => {
    if (userRole === "official") {
      return "hover:!bg-red-50 hover:!text-red-600 transition-all duration-200";
    }
    return "hover:bg-gray-100";
  };
  
  useEffect(() => {
    if (isActive && hasSubmenu && !isOpen) {
      onToggle(item.path);
    }
  }, [pathname]);

  if (hasSubmenu) {
    return (
      <Collapsible 
        open={isOpen} 
        onOpenChange={() => {}}
        className="w-full transition-all duration-300 ease-in-out"
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            onClick={(e) => {
              onToggle(item.path, e);
              setActiveSection(item.path);
            }}
            className={cn(
              "flex w-full items-center justify-between px-3 py-1.5 text-sm rounded-lg transition-all duration-300 ease-in-out",
              isActive && !isOpen && getActiveColors(),
              isOpen && getOpenColors(),
              !isActive && !isOpen && getHoverColors(),
              isCollapsed && "px-0 justify-center"
            )}
          >
            <div className={cn(
              "flex items-center gap-3",
              isCollapsed && "justify-center"
            )}>
              {item.icon && (
                <div className={cn(
                  "flex items-center justify-center w-5 h-5",
                  isCollapsed && "w-10 h-10"
                )}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
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
              {!isCollapsed && <span className={cn(
                "text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]",
                (isActive || isOpen) && "font-medium"
              )}>{item.title}</span>}
            </div>
            {!isCollapsed && (
              <div className="flex items-center">
                {item.title === "Orders" && (
                  <Badge variant="secondary" className="mr-2 px-1.5 py-0.5 text-xs">3</Badge>
                )}
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 ease-in-out" />
                ) : (
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-in-out" />
                )}
              </div>
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {!isCollapsed && (
          <CollapsibleContent className={cn(
            "overflow-hidden transition-[max-height] duration-300 ease-in-out",
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className={cn(
              "pl-4 relative ml-5 mt-1 space-y-0.5",
              userRole === "official" ? "border-l border-red-200" : "border-l border-gray-200",
              level > 0 && "ml-4"
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
                      activeSection={activeSection}
                      setActiveSection={setActiveSection}
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
      onClick={() => setActiveSection(item.path)}
      className={cn(
        "flex items-center gap-3 px-3 py-1.5 text-sm rounded-lg transition-all duration-200",
        isActive
          ? getActiveColors()
          : getHoverColors(),
        isCollapsed && "justify-center px-0",
        level > 0 && "relative"
      )}
    >      
      {item.icon && (
        <div className={cn(
          "flex items-center justify-center w-5 h-5",
          isCollapsed && "w-10 h-10"
        )}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
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
      {!isCollapsed && (
        <div className="flex items-center justify-between flex-1">
          <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{item.title}</span>
          {item.title === "Orders" && (
            <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">3</Badge>
          )}
        </div>
      )}
    </Link>
  );
}
