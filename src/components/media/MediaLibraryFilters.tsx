
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { X, Users, FolderOpen, CalendarDays, Filter } from "lucide-react";

export function MediaLibraryFilters({ filters, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Fetch users for filtering
  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      user: null,
      category: null,
      startDate: null,
      endDate: null
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const handleUserChange = (value: string) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      user: value === "all" ? null : value 
    }));
  };

  const handleCategoryChange = (value: string) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      category: value === "all" ? null : value 
    }));
  };

  const hasActiveFilters = localFilters.user || localFilters.category || localFilters.startDate || localFilters.endDate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {localFilters.user && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                <Users className="h-3 w-3 mr-1" />
                User: {users?.find(u => u.id === localFilters.user)?.first_name || 'Unknown'}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-blue-600"
                  onClick={() => setLocalFilters(prev => ({ ...prev, user: null }))}
                />
              </Badge>
            )}
            {localFilters.category && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                <FolderOpen className="h-3 w-3 mr-1" />
                Category: {localFilters.category}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-blue-600"
                  onClick={() => setLocalFilters(prev => ({ ...prev, category: null }))}
                />
              </Badge>
            )}
            {(localFilters.startDate || localFilters.endDate) && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                <CalendarDays className="h-3 w-3 mr-1" />
                Date range
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-blue-600"
                  onClick={() => setLocalFilters(prev => ({ ...prev, startDate: null, endDate: null }))}
                />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* User Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            Filter by User
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select 
            value={localFilters.user || "all"}
            onValueChange={handleUserChange}
          >
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              {users?.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-blue-600" />
            Filter by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select 
            value={localFilters.category || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {['image', 'video', 'audio', 'document', 'other'].map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Date Range Filter */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            Filter by Date Range
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Calendar
            mode="range"
            selected={{ from: localFilters.startDate, to: localFilters.endDate }}
            onSelect={(range) => setLocalFilters(prev => ({ 
              ...prev, 
              startDate: range?.from || null, 
              endDate: range?.to || null
            }))}
            className="rounded-md border border-gray-200"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-100 rounded-md",
              day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </CardContent>
      </Card>

      {/* Apply Button */}
      <Button 
        onClick={handleApplyFilters} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition-colors"
      >
        Apply Filters
      </Button>
    </div>
  );
}
