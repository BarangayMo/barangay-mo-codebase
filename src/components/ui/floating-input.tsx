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
    const isActive =
      type === "date"
        ? true // always float for date input
        : isFocused || (props.value && props.value.toString().length > 0);

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
              "h-14 transition-all bg-background px-4 pt-5 pb-2 w-full rounded-md border",
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
              "absolute pointer-events-none transition-all duration-200",
              isActive
                ? cn("text-xs top-1.5", icon ? "left-10" : "left-4")
                : cn("text-base top-3.5", icon ? "left-10" : "left-4"),
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

