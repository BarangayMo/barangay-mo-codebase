
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
import { useState, useEffect } from "react";

interface MenuItemProps {
  item: any;
  level?: number;
  isCollapsed?: boolean;
  openSections: Record<string, boolean>;
  onToggle: (sectionId: string, event: React.MouseEvent) => void;
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
      onToggle(item.path, {} as React.MouseEvent);
    }
  }, [pathname]);

  if (hasSubmenu) {
    return (
      <Collapsible 
        open={isOpen} 
        onOpenChange={() => {}}
        className="w-full transition-all duration-200"
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            onClick={(e) => {
              onToggle(item.path, e);
              setActiveSection(item.path);
            }}
            className={cn(
              "flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-all",
              isActive && !isOpen && "bg-blue-50 text-blue-600",
              isOpen && "bg-gray-100",
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
                "text-sm",
                (isActive || isOpen) && "font-medium"
              )}>{item.title}</span>}
            </div>
            {!isCollapsed && (
              <div className="flex items-center">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                )}
              </div>
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {!isCollapsed && (
          <CollapsibleContent className="animate-accordion-down overflow-hidden transition-all duration-300">
            <div className={cn(
              "pl-4 border-l border-gray-200 ml-3 mt-1 space-y-1",
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
        "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
        isActive
          ? "bg-blue-50 text-blue-600 font-medium"
          : "hover:bg-gray-100",
        isCollapsed && "justify-center px-0"
      )}
    >
      {level > 0 && !isCollapsed ? (
        <div className="w-5 h-5 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
        </div>
      ) : (
        item.icon && (
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
        )
      )}
      {!isCollapsed && <span className="text-sm">{item.title}</span>}
    </Link>
  );
}
