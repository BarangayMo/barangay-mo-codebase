
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const FAVICON_MAP = {
  resident: '/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png',
  official: '/lovable-uploads/141c2a56-35fc-4123-a51f-358481e0f167.png',
  superadmin: '/lovable-uploads/141c2a56-35fc-4123-a51f-358481e0f167.png',
  default: '/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png'
};

const FaviconManager = () => {
  const { userRole } = useAuth();

  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    
    if (favicon) {
      const faviconPath = FAVICON_MAP[userRole ?? 'default'];
      favicon.href = faviconPath;
    }
  }, [userRole]);

  return null;
};

export default FaviconManager;
