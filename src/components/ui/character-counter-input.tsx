
import React from 'react';
import { Input } from './input';
import { Label } from './label';

interface CharacterCounterInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const CharacterCounterInput: React.FC<CharacterCounterInputProps> = ({
  id,
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  required = false,
  className = ""
}) => {
  const remaining = maxLength - value.length;
  const isNearLimit = remaining <= 20;
  const isOverLimit = remaining < 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <Label htmlFor={id} className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <span className={`text-xs ${
          isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-gray-500'
        }`}>
          {value.length}/{maxLength}
        </span>
      </div>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${isOverLimit ? 'border-red-500 focus:border-red-500' : ''}`}
      />
      {isOverLimit && (
        <p className="text-xs text-red-500">
          Character limit exceeded by {Math.abs(remaining)} characters
        </p>
      )}
    </div>
  );
};

export { CharacterCounterInput };
