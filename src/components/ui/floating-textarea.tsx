
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
}

export const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ label, id, error, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const isActive = isFocused || (props.value && props.value.toString().length > 0);
    
    return (
      <div className="relative">
        <div className="relative">
          <Textarea
            id={id}
            ref={ref}
            className={cn(
              "pt-6 pb-2 px-4 min-h-[100px] transition-all bg-background",
              error ? "border-destructive" : "border-input",
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          <Label
            htmlFor={id}
            className={cn(
              "absolute left-4 pointer-events-none transition-all duration-200",
              isActive
                ? "text-xs translate-y-2"
                : "text-base translate-y-4",
              error ? "text-destructive" : "text-muted-foreground",
              isActive && !error && isFocused && "text-primary"
            )}
          >
            {label}
          </Label>
        </div>
        {error && <p className="text-destructive text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

FloatingTextarea.displayName = "FloatingTextarea";
