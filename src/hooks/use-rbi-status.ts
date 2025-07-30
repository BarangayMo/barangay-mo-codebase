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

  // Find the form with the most recent decision with highest precedence
  // Precedence: superadmin (2) > official (1)
  const latestForm = rbiForms?.[0]; // Already sorted by submitted_at desc
  
  if (!latestForm) {
    return {
      status: 'not-submitted' as RbiStatus,
      hasAccess: false,
      isLoading,
      latestForm: null
    };
  }

  // If the form has been reviewed, use the status of the highest precedence reviewer
  // Otherwise, use the current status
  const status = latestForm.status as RbiStatus;
  const hasAccess = status === 'approved';

  return {
    status,
    hasAccess,
    isLoading,
    latestForm
  };
}