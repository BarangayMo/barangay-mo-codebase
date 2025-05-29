
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export interface MediaLibraryFiltersProps {
  filters: {
    user: string | null;
    category: string | null;
    startDate: Date | null;
    endDate: Date | null;
  };
  onFiltersChange: (filters: {
    user: string | null;
    category: string | null;
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
}

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
}

export function MediaLibraryFilters({ filters, onFiltersChange }: MediaLibraryFiltersProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .order('first_name');
      
      if (!error && data) {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  const handleUserChange = (userId: string) => {
    onFiltersChange({
      ...filters,
      user: userId === "all" ? null : userId,
    });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category === "all" ? null : category,
    });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      startDate: date || null,
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      endDate: date || null,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      user: null,
      category: null,
      startDate: null,
      endDate: null,
    });
  };

  const hasActiveFilters = filters.user || filters.category || filters.startDate || filters.endDate;

  const formatUserName = (user: UserProfile) => {
    const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Unknown User';
    return name;
  };

  const getRoleBadge = (role: string | null) => {
    if (!role) return null;
    
    const roleColors: Record<string, string> = {
      admin: "bg-blue-100 text-blue-700",
      moderator: "bg-purple-100 text-purple-700", 
      user: "bg-gray-100 text-gray-700",
      official: "bg-green-100 text-green-700",
      resident: "bg-orange-100 text-orange-700"
    };

    return (
      <Badge 
        variant="secondary" 
        className={`ml-2 text-xs px-2 py-0.5 ${roleColors[role] || "bg-gray-100 text-gray-700"}`}
      >
        {role}
      </Badge>
    );
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex flex-wrap gap-3 flex-1">
        {/* User Filter */}
        <Select value={filters.user || "all"} onValueChange={handleUserChange}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{formatUserName(user)}</span>
                  {getRoleBadge(user.role)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={filters.category || "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
          </SelectContent>
        </Select>

        {/* Start Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[140px] justify-start text-left font-normal bg-white",
                !filters.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? format(filters.startDate, "MMM dd") : "Start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.startDate || undefined}
              onSelect={handleStartDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* End Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[140px] justify-start text-left font-normal bg-white",
                !filters.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate ? format(filters.endDate, "MMM dd") : "End date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.endDate || undefined}
              onSelect={handleEndDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
