
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"
import { X } from "lucide-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      duration={4000}
      closeButton={true}
      toastOptions={{
        style: {
          position: 'relative',
          overflow: 'hidden'
        },
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg relative overflow-hidden",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: "group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border group-[.toast]:border-border hover:group-[.toast]:bg-muted",
        },
        unstyled: false,
      }}
      {...props}
    />
  )
}

// Enhanced toast function with progress bar
const enhancedToast = {
  ...toast,
  success: (message: string, options?: any) => {
    return toast.success(message, {
      ...options,
      style: {
        ...options?.style,
        position: 'relative',
        overflow: 'hidden',
      },
      jsx: (
        <div className="w-full">
          <div>{message}</div>
          <div 
            className="absolute bottom-0 left-0 h-1 bg-green-500 animate-[progress_4s_linear]"
            style={{
              animation: 'progress 4s linear forwards',
            }}
          />
          <style jsx>{`
            @keyframes progress {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      )
    });
  },
  error: (message: string, options?: any) => {
    return toast.error(message, {
      ...options,
      style: {
        ...options?.style,
        position: 'relative',
        overflow: 'hidden',
      },
      jsx: (
        <div className="w-full">
          <div>{message}</div>
          <div 
            className="absolute bottom-0 left-0 h-1 bg-red-500"
            style={{
              animation: 'progress 4s linear forwards',
            }}
          />
          <style jsx>{`
            @keyframes progress {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      )
    });
  },
  info: (message: string, options?: any) => {
    return toast.info(message, {
      ...options,
      style: {
        ...options?.style,
        position: 'relative',
        overflow: 'hidden',
      },
      jsx: (
        <div className="w-full">
          <div>{message}</div>
          <div 
            className="absolute bottom-0 left-0 h-1 bg-blue-500"
            style={{
              animation: 'progress 4s linear forwards',
            }}
          />
          <style jsx>{`
            @keyframes progress {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      )
    });
  }
};

export { Toaster, enhancedToast as toast }
