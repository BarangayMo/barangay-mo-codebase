
import React from 'react';
import { X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface EnhancedToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  icon?: React.ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive';
  }>;
  onClose: () => void;
  duration?: number;
}

export const EnhancedToast: React.FC<EnhancedToastProps> = ({
  title,
  description,
  variant = 'default',
  icon,
  actions,
  onClose,
  duration = 5000
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  // Always render on desktop and mobile for now to debug
  console.log('Enhanced toast rendering:', { title, isDesktop });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50',
          icon: 'text-red-600',
          title: 'text-red-900',
          description: 'text-red-700'
        };
      case 'success':
        return {
          border: 'border-green-200',
          bg: 'bg-green-50',
          icon: 'text-green-600',
          title: 'text-green-900',
          description: 'text-green-700'
        };
      case 'warning':
        return {
          border: 'border-yellow-200',
          bg: 'bg-yellow-50',
          icon: 'text-yellow-600',
          title: 'text-yellow-900',
          description: 'text-yellow-700'
        };
      default:
        return {
          border: 'border-blue-200',
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          title: 'text-blue-900',
          description: 'text-blue-700'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 w-96 rounded-lg border shadow-lg transition-all duration-300 ease-in-out",
      styles.border,
      styles.bg,
      "animate-in slide-in-from-top-2"
    )}>
      <div className="flex items-start p-4 gap-3">
        {/* App Icon / Status Icon */}
        {icon && (
          <div className={cn("flex-shrink-0 mt-0.5", styles.icon)}>
            {icon}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className={cn("font-semibold text-sm", styles.title)}>
            {title}
          </div>
          {description && (
            <div className={cn("text-sm mt-1", styles.description)}>
              {description}
            </div>
          )}
          
          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    action.variant === 'destructive' 
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

// Hook for using enhanced toasts
export const useEnhancedToast = () => {
  const [toasts, setToasts] = React.useState<Array<EnhancedToastProps & { id: string }>>([]);

  const showToast = React.useCallback((toast: Omit<EnhancedToastProps, 'onClose'>) => {
    console.log('showToast called with:', toast);
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      ...toast,
      id,
      onClose: () => {
        console.log('Closing toast:', id);
        setToasts(prev => prev.filter(t => t.id !== id));
      }
    };
    
    setToasts(prev => {
      console.log('Adding toast to state:', [...prev, newToast]);
      return [...prev, newToast];
    });
  }, []);

  const ToastContainer = React.useCallback(() => {
    console.log('ToastContainer rendering, toasts:', toasts);
    return (
      <>
        {toasts.map(toast => (
          <EnhancedToast key={toast.id} {...toast} />
        ))}
      </>
    );
  }, [toasts]);

  return { showToast, ToastContainer };
};
