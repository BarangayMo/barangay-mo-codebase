
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FloatingSelectProps {
  label: string;
  id: string;
  className?: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function FloatingSelect({
  label,
  id,
  error,
  className,
  icon,
  children,
  defaultValue,
  value,
  onValueChange,
  placeholder,
  disabled,
}: FloatingSelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || (!!value && value !== "") || (!!defaultValue && defaultValue !== "");

  
  return (
    <div className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
            {icon}
          </div>
        )}
        <Select
          defaultValue={defaultValue}
          value={value}
          onValueChange={onValueChange}
          onOpenChange={(open) => setIsFocused(open)}
        >
          <SelectTrigger
            id={id}
            className={cn(
              "h-14 transition-all bg-background w-full border pt-6 pb-2",
              icon && "pl-10",
              error ? "border-destructive" : "border-input",
              className
            )}
            disabled={disabled}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
        <Label
          htmlFor={id}
          className={cn(
            "absolute left-0 pointer-events-none transition-all duration-200 z-20",
            isActive
              ? cn("text-xs top-2", icon ? "left-10" : "left-4", "bg-background px-1 -ml-1")
              : cn("text-sm top-4", icon ? "left-10" : "left-4"),
            error ? "text-destructive" : "text-muted-foreground",
            isFocused && !error && "text-primary"
          )}
        >
          {label}
        </Label>
      </div>
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
}

FloatingSelect.displayName = "FloatingSelect";
