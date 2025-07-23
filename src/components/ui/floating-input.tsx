import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  icon?: React.ReactNode;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, id, error, className, icon, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const isActive = true; // Always keep label floating for better UX

    return (
      <div className="relative">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
              {icon}
            </div>
          )}
          <Input
            id={id}
            ref={ref}
            type={type}
            aria-invalid={!!error}
            className={cn(
              "h-14 transition-all bg-background px-4 pt-6 pb-2 w-full rounded-md border",
              icon && "pl-10",
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
            placeholder={type === "date" ? undefined : props.placeholder} // Don't force placeholder for date
          />
          <Label
            htmlFor={id}
            className={cn(
              "absolute pointer-events-none transition-all duration-200 z-20",
              isActive
                ? cn("text-xs top-2", icon ? "left-10" : "left-4", "bg-background px-1 -ml-1")
                : cn("text-sm top-4", icon ? "left-10" : "left-4"),
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

