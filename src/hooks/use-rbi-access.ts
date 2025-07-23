import { useAuth } from '@/contexts/AuthContext';
import { useRbiForms } from '@/hooks/use-rbi-forms';
import { toast } from 'sonner';

export function useRbiAccess() {
  const { userRole, rbiCompleted } = useAuth();
  const { rbiForms, isLoading } = useRbiForms();

  // Check if user has approved RBI access
  const latestForm = rbiForms?.[0];
  const isApproved = latestForm?.status === 'approved';
  const hasRbiAccess = userRole !== 'resident' || isApproved || rbiCompleted;

  const showAccessDeniedToast = () => {
    toast('Registration Required', {
      description: 'You must complete your Barangay Registration Form before accessing the platform.',
      duration: 3000,
      className: 'border-red-200 bg-red-50 text-red-800',
    });
  };

  const checkAccess = (callback?: () => void) => {
    if (hasRbiAccess) {
      callback?.();
      return true;
    } else {
      showAccessDeniedToast();
      return false;
    }
  };

  return {
    hasRbiAccess,
    isLoading,
    checkAccess,
    showAccessDeniedToast
  };
}