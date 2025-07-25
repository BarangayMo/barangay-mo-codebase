
import { UserRole } from '@/contexts/AuthContext';

export const getRedirectPath = (role: UserRole, email?: string): string => {
  if (role === 'official') {
    return '/official-dashboard';
  } else if (role === 'superadmin') {
    return '/admin';
  } else if (email && email.includes('official')) {
    return '/official-dashboard';
  } else {
    return '/resident-home';
  }
};

export const shouldRedirectFromAuthPages = (pathname: string): boolean => {
  const authPages = ['/login', '/register', '/email-confirmation', '/mpin'];
  return authPages.includes(pathname);
};
