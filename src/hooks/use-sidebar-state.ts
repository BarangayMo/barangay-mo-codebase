
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sidebarMenuItems } from '@/config/sidebar-menu';

export const useSidebarState = () => {
  const { pathname } = useLocation();
  // Start with empty state instead of restoring from localStorage
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    const parentPaths: string[] = [];
    for (let i = 1; i <= pathSegments.length; i++) {
      const path = `/${pathSegments.slice(0, i).join('/')}`;
      parentPaths.push(path);
    }

    const newOpenSections: Record<string, boolean> = {};
    let currentActiveSection = activeSection;
    let found = false;
    
    // Function to check if the current pathname is the Dashboard path
    // and only set it as active when it's exactly the dashboard path
    const isDashboardPath = (path: string) => {
      const dashboardPath = "/admin";
      return path === dashboardPath && pathname === dashboardPath;
    };
    
    const checkMenuItems = (items: any[]) => {
      items.forEach(group => {
        group.items.forEach((item: any) => {
          // Special case for Dashboard - only set it as active if the path exactly matches
          if (isDashboardPath(item.path)) {
            currentActiveSection = item.path;
            found = true;
            return;
          }
          
          // For other menu items, only auto-expand if we're navigating to a nested route
          if (parentPaths.includes(item.path) && item.path !== "/admin") {
            // Only expand if the current path is actually within this section
            const isWithinSection = pathname.startsWith(item.path + '/') || pathname === item.path;
            if (isWithinSection) {
              newOpenSections[item.path] = true;
              currentActiveSection = item.path;
              found = true;
              
              if (item.submenu) {
                item.submenu.forEach((subItem: any) => {
                  if (parentPaths.includes(subItem.path)) {
                    newOpenSections[item.path] = true;
                    currentActiveSection = subItem.path;
                    
                    if (subItem.submenu) {
                      subItem.submenu.forEach((deepSubItem: any) => {
                        if (parentPaths.includes(deepSubItem.path)) {
                          newOpenSections[subItem.path] = true;
                          currentActiveSection = deepSubItem.path;
                        }
                      });
                    }
                  }
                });
              }
            }
          }
        });
      });
    };

    checkMenuItems(sidebarMenuItems);
    
    if (found || pathname === "/admin") {
      setOpenSections(newOpenSections);
      setActiveSection(currentActiveSection);
    }
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem("sidebar-state", JSON.stringify(openSections));
  }, [openSections]);

  const toggleSection = (sectionId: string, event?: React.MouseEvent) => {
    // Only prevent default if we have a real event object
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Close all other sections except the one being toggled
    const newOpenSections = { ...openSections };
    
    // If the section is already open, simply close it
    if (newOpenSections[sectionId]) {
      newOpenSections[sectionId] = false;
    } else {
      // Find all sections at the same level and close them
      const findSectionLevel = (items: any[], targetPath: string, level = 0): number => {
        for (const group of items) {
          for (const item of group.items) {
            if (item.path === targetPath) {
              return level;
            }
            if (item.submenu) {
              const foundLevel = findSectionLevel(
                [{ items: item.submenu }], 
                targetPath, 
                level + 1
              );
              if (foundLevel > level) {
                return foundLevel;
              }
            }
          }
        }
        return -1;
      };

      const targetLevel = findSectionLevel(sidebarMenuItems, sectionId);
      
      // Close all sections at the same level
      const closeSectionsAtSameLevel = (items: any[], level: number, currentLevel = 0) => {
        if (level === currentLevel) {
          items.forEach(group => {
            group.items.forEach((item: any) => {
              if (item.path !== sectionId) {
                newOpenSections[item.path] = false;
              }
            });
          });
        } else {
          items.forEach(group => {
            group.items.forEach((item: any) => {
              if (item.submenu) {
                closeSectionsAtSameLevel(
                  [{ items: item.submenu }], 
                  level, 
                  currentLevel + 1
                );
              }
            });
          });
        }
      };
      
      if (targetLevel >= 0) {
        closeSectionsAtSameLevel(sidebarMenuItems, targetLevel);
      }
      
      // Open the target section
      newOpenSections[sectionId] = true;
    }
    
    setOpenSections(newOpenSections);
  };

  return {
    openSections,
    toggleSection,
    activeSection,
    setActiveSection
  };
};
