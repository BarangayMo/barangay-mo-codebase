
import React from 'react';
import { Input } from './input';
import { Button } from './button';
import { Plus, Trash2 } from 'lucide-react';
import { Label } from './label';

interface EnhancedArrayInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
  className?: string;
}

const EnhancedArrayInput: React.FC<EnhancedArrayInputProps> = ({
  label,
  items = [],
  onChange,
  placeholder = "Enter item",
  addButtonText = "Add Item",
  className = ""
}) => {
  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, ""]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeItem(index)}
              className="shrink-0 h-10 w-10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {addButtonText}
        </Button>
      </div>
    </div>
  );
};

export { EnhancedArrayInput };
