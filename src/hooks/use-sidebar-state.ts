
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sidebarMenuItems } from '@/config/sidebar-menu';

export const useSidebarState = () => {
  const { pathname } = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const savedState = localStorage.getItem("sidebar-state");
    return savedState ? JSON.parse(savedState) : {};
  });

  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    const parentPaths: string[] = [];
    for (let i = 1; i <= pathSegments.length; i++) {
      const path = `/${pathSegments.slice(0, i).join('/')}`;
      parentPaths.push(path);
    }

    const newOpenSections = { ...openSections };
    
    const checkSubmenu = (items: any[]) => {
      items.forEach(item => {
        if (parentPaths.includes(item.path)) {
          newOpenSections[item.path] = true;
          
          if (item.submenu) {
            checkSubmenu(item.submenu);
          }
        }
      });
    };

    checkSubmenu(sidebarMenuItems);
    setOpenSections(newOpenSections);
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem("sidebar-state", JSON.stringify(openSections));
  }, [openSections]);

  const toggleSection = (sectionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return {
    openSections,
    toggleSection
  };
};

