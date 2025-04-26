
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomerViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
}

export const CustomerViewToggle = ({ viewMode, onViewChange }: CustomerViewToggleProps) => {
  return (
    <div className="border rounded-md flex">
      <Button 
        variant="ghost" 
        size="icon"
        className={cn(
          "rounded-none", 
          viewMode === 'grid' && "bg-gray-100"
        )}
        onClick={() => onViewChange('grid')}
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        className={cn(
          "rounded-none",
          viewMode === 'list' && "bg-gray-100"
        )}
        onClick={() => onViewChange('list')}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};
