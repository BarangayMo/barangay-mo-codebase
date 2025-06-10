
import React from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface CharacterLimitedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maxLength: number;
  showCounter?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CharacterLimitedInput = ({ 
  maxLength, 
  showCounter = true, 
  value, 
  onChange, 
  className,
  ...props 
}: CharacterLimitedInputProps) => {
  const remainingChars = maxLength - value.length;
  const isNearLimit = remainingChars <= 20;
  const isAtLimit = remainingChars <= 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxLength) {
      onChange(e);
    }
  };

  return (
    <div className="space-y-1">
      <Input
        {...props}
        value={value}
        onChange={handleChange}
        className={cn(
          className,
          isAtLimit && "border-destructive focus-visible:ring-destructive"
        )}
      />
      {showCounter && (
        <div className="flex justify-end">
          <span className={cn(
            "text-xs",
            isNearLimit ? "text-destructive" : "text-muted-foreground"
          )}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};
