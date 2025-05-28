
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
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isOpen = openSections[item.path] || false;
  const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
  
  useEffect(() => {
    if (isActive && hasSubmenu && !isOpen) {
      // Call onToggle without an event object when auto-opening
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
              "flex w-full items-center justify-between px-3 py-1.5 text-sm hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out",
              isActive && !isOpen && "bg-blue-50 text-blue-600 font-medium",
              isOpen && "bg-gray-100 font-medium",
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
          <CollapsibleContent className="animate-accordion-down transition-all duration-300 ease-in-out">
            <div className={cn(
              "pl-4 relative border-l border-gray-200 ml-5 mt-1 space-y-0.5",
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
          ? "bg-blue-50 text-blue-600 font-medium"
          : "hover:bg-gray-100",
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
