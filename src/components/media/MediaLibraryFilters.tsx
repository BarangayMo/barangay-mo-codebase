
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MediaLibraryFilters } from "@/hooks/media-library/types";
import { Badge } from "@/components/ui/badge";

interface FilterProps {
  filters: MediaLibraryFilters;
  onFilterChange: (filters: MediaLibraryFilters) => void;
}

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
}

const getRoleColor = (role: string | null): string => {
  switch (role?.toLowerCase()) {
    case 'superadmin':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'admin':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'editor':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'moderator':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export function MediaLibraryFilters({ filters, onFilterChange }: FilterProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Fetch users for filtering
  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role');
      
      if (error) throw error;
      return data as User[];
    }
  });

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const formatUserName = (user: User) => {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">User</label>
          <Select 
            value={localFilters.user || ''}
            onValueChange={(value) => setLocalFilters(prev => ({ ...prev, user: value === '' ? null : value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Users</SelectItem>
              {users?.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <span>{formatUserName(user)}</span>
                    {user.role && (
                      <Badge variant="outline" className={`text-xs py-0.5 px-1.5 rounded-md ${getRoleColor(user.role)}`}>
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select 
            value={localFilters.category || ''}
            onValueChange={(value) => setLocalFilters(prev => ({ ...prev, category: value === '' ? null : value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {['profile', 'marketplace', 'jobs', 'misc'].map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date Range</label>
          <Calendar
            mode="range"
            selected={{ from: localFilters.startDate || undefined, to: localFilters.endDate || undefined }}
            onSelect={(range) => setLocalFilters(prev => ({ 
              ...prev, 
              startDate: range?.from || null, 
              endDate: range?.to || null 
            }))}
          />
        </div>

        <Button onClick={handleApplyFilters} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
