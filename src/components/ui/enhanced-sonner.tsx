
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg relative overflow-hidden",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        unstyled: false,
      }}
      {...props}
    />
  )
}

// Enhanced toast with progress bar and close button
const enhancedToast = {
  success: (message: string, options?: any) => {
    return toast.success(message, {
      ...options,
      action: {
        label: <X className="h-4 w-4" />,
        onClick: () => toast.dismiss(),
      },
      style: {
        position: 'relative',
      },
      className: 'toast-with-progress',
    });
  },
  error: (message: string, options?: any) => {
    return toast.error(message, {
      ...options,
      action: {
        label: <X className="h-4 w-4" />,
        onClick: () => toast.dismiss(),
      },
      style: {
        position: 'relative',
      },
      className: 'toast-with-progress',
    });
  },
  info: (message: string, options?: any) => {
    return toast.info(message, {
      ...options,
      action: {
        label: <X className="h-4 w-4" />,
        onClick: () => toast.dismiss(),
      },
      style: {
        position: 'relative',
      },
      className: 'toast-with-progress',
    });
  },
  warning: (message: string, options?: any) => {
    return toast.warning(message, {
      ...options,
      action: {
        label: <X className="h-4 w-4" />,
        onClick: () => toast.dismiss(),
      },
      style: {
        position: 'relative',
      },
      className: 'toast-with-progress',
    });
  },
};

export { Toaster, enhancedToast as toast }
