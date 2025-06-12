import React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export interface EnhancedToastProps {
  id?: string;
  title: string;
  description?: string;
  type: "success" | "error" | "info" | "warning";
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  duration?: number;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-white",
    borderColor: "border-green-200",
    iconColor: "text-green-600",
    progressColor: "bg-green-500"
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-white",
    borderColor: "border-red-200",
    iconColor: "text-red-600",
    progressColor: "bg-red-500"
  },
  info: {
    icon: Info,
    bgColor: "bg-white",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    progressColor: "bg-blue-500"
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-white",
    borderColor: "border-orange-200",
    iconColor: "text-orange-600",
    progressColor: "bg-orange-500"
  }
};

export const EnhancedToast: React.FC<EnhancedToastProps> = ({
  title,
  description,
  type,
  action,
  onDismiss,
  duration = 4000
}) => {
  const isMobile = useIsMobile();
  const config = typeConfig[type];
  const Icon = config.icon;

  // Don't render on mobile
  if (isMobile) {
    return null;
  }

  return (
    <div className={cn(
      "relative w-full max-w-sm rounded-xl border shadow-lg overflow-hidden",
      config.bgColor,
      config.borderColor
    )}>
      {/* Main content */}
      <div className="flex items-start gap-3 p-4">
        {/* App icon placeholder */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={cn("w-4 h-4", config.iconColor)} />
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {title}
                </h4>
              </div>
              {description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            
            {/* Close button */}
            <button
              onClick={onDismiss}
              className="flex-shrink-0 ml-2 p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Action button */}
          {action && (
            <div className="mt-3">
              <button
                onClick={action.onClick}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
        <div 
          className={cn("h-full transition-all ease-linear", config.progressColor)}
          style={{
            animation: `shrinkProgress ${duration}ms linear forwards`
          }}
        />
      </div>

      {/* Add keyframes via a style element */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shrinkProgress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `
      }} />
    </div>
  );
};

// Enhanced toast hook
export const useEnhancedToast = () => {
  const showToast = (props: Omit<EnhancedToastProps, 'id'>) => {
    // This would integrate with your toast system
    // For now, we'll create a simple implementation
    const toastId = Math.random().toString(36).substr(2, 9);
    
    // Create and mount toast element
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toastElement = document.createElement('div');
    toastElement.id = toastId;
    
    // You would render the React component here using ReactDOM.render or similar
    // This is a simplified implementation
    toastContainer.appendChild(toastElement);
    
    // Auto-remove after duration
    setTimeout(() => {
      const element = document.getElementById(toastId);
      if (element) {
        element.remove();
      }
    }, props.duration || 4000);
    
    return toastId;
  };

  return { showToast };
};

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
  document.body.appendChild(container);
  return container;
}
