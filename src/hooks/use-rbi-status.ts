import { useAuth } from '@/contexts/AuthContext';
import { useRbiForms } from '@/hooks/use-rbi-forms';

export type RbiStatus = 'not-submitted' | 'submitted' | 'under-review' | 'approved' | 'rejected';

export function useRbiStatus() {
  const { userRole } = useAuth();
  const { rbiForms, isLoading } = useRbiForms();

  // Non-residents always have access
  if (userRole !== 'resident') {
    return {
      status: 'approved' as RbiStatus,
      hasAccess: true,
      isLoading: false,
      latestForm: null
    };
  }

  const latestForm = rbiForms?.[0];
  
  if (!latestForm) {
    return {
      status: 'not-submitted' as RbiStatus,
      hasAccess: false,
      isLoading,
      latestForm: null
    };
  }

  const status = latestForm.status as RbiStatus;
  const hasAccess = status === 'approved';

  return {
    status,
    hasAccess,
    isLoading,
    latestForm
  };
}