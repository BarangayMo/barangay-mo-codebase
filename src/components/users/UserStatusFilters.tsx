
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, UserCheck, UserX, Archive, Users } from "lucide-react";

interface UserStatusFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function UserStatusFilters({ activeFilter, onFilterChange }: UserStatusFiltersProps) {
  const filters = [
    { id: "all", label: "All", icon: Users, count: null },
    { id: "invited", label: "Invited", icon: UserCheck, count: null },
    { id: "enabled", label: "Enabled", icon: CheckCircle, count: null },
    { id: "disabled", label: "Disabled", icon: UserX, count: null },
    { id: "archived", label: "Archived", icon: Archive, count: null },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className={`flex items-center gap-2 ${
            activeFilter === filter.id 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "hover:bg-gray-50"
          }`}
        >
          <filter.icon className="h-4 w-4" />
          <span>{filter.label}</span>
          {filter.count && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {filter.count}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
}
