
import React from 'react';
import { Button } from './button';
import { Input } from './input';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArrayInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  addButtonText?: string;
}

export const ArrayInput = ({ 
  values, 
  onChange, 
  placeholder, 
  className,
  addButtonText = "Add Item"
}: ArrayInputProps) => {
  const handleItemChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const removeItem = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const addItem = () => {
    onChange([...values, ""]);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2 group">
          <div className="flex items-center text-muted-foreground cursor-grab">
            <GripVertical className="h-4 w-4" />
          </div>
          <Input
            value={value}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeItem(index)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <Button
        variant="outline"
        onClick={addItem}
        className="w-full border-dashed"
        type="button"
      >
        <Plus className="h-4 w-4 mr-2" />
        {addButtonText}
      </Button>
    </div>
  );
};
