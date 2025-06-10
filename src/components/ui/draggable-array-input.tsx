
import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableArrayInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  addButtonText?: string;
}

export const DraggableArrayInput = ({ 
  values, 
  onChange, 
  placeholder, 
  className,
  addButtonText = "Add Item"
}: DraggableArrayInputProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newValues = [...values];
    const draggedItem = newValues[draggedIndex];
    
    // Remove the dragged item
    newValues.splice(draggedIndex, 1);
    
    // Insert at the new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newValues.splice(insertIndex, 0, draggedItem);
    
    onChange(newValues);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {values.map((value, index) => (
        <div 
          key={index} 
          className={cn(
            "flex items-center gap-2 group",
            draggedIndex === index && "opacity-50"
          )}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
        >
          <div className="flex items-center text-muted-foreground cursor-grab hover:text-foreground transition-colors">
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
