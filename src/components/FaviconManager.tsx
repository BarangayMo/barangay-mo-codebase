
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const FaviconManager = () => {
  const { userRole } = useAuth();

  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    
    if (favicon) {
      switch (userRole) {
        case 'resident':
          favicon.href = '/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png';
          break;
        case 'official':
          favicon.href = '/lovable-uploads/141c2a56-35fc-4123-a51f-358481e0f167.png';
          break;
        default:
          favicon.href = '/lovable-uploads/141c2a56-35fc-4123-a51f-358481e0f167.png';
      }
    }
  }, [userRole]);

  return null;
};

export default FaviconManager;
