
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface CustomerSearchProps {
  onSearch?: (value: string) => void;
  onStatusChange?: (value: string) => void;
}

export const CustomerSearch = ({ onSearch, onStatusChange }: CustomerSearchProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search customers..." 
          className="pl-9" 
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <Select defaultValue="all" onValueChange={onStatusChange}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
