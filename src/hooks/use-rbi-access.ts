import { useRbiStatus } from '@/hooks/use-rbi-status';

export function useRbiAccess() {
  const { hasAccess, isLoading } = useRbiStatus();

  return {
    hasRbiAccess: hasAccess,
    isLoading,
    checkAccess: (callback?: () => void) => {
      if (hasAccess) {
        callback?.();
        return true;
      }
      return false;
    },
    showAccessDeniedToast: () => {} // No longer needed, handled by route protection
  };
}