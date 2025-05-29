
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { X, Users, FolderOpen, CalendarDays, Filter, Image, Video, Music, FileText, File, Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function MediaLibraryFilters({ filters, onFiltersChange }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [userSearchOpen, setUserSearchOpen] = useState(false);
  const [categorySearchOpen, setCategorySearchOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // Fetch users with their roles for filtering - using only existing columns
  const { data: users } = useQuery({
    queryKey: ['admin-users-with-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role');
      
      if (error) throw error;
      return data;
    }
  });

  const categories = [
    { value: 'image', label: 'Image', icon: Image, color: 'text-blue-500' },
    { value: 'video', label: 'Video', icon: Video, color: 'text-purple-500' },
    { value: 'audio', label: 'Audio', icon: Music, color: 'text-green-500' },
    { value: 'document', label: 'Document', icon: FileText, color: 'text-orange-500' },
    { value: 'other', label: 'Other', icon: File, color: 'text-gray-500' }
  ];

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      user: null,
      category: null,
      startDate: null,
      endDate: null
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = localFilters.user || localFilters.category || localFilters.startDate || localFilters.endDate;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-700';
      case 'admin':
        return 'bg-blue-100 text-blue-700';
      case 'moderator':
        return 'bg-green-100 text-green-700';
      case 'resident':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return first + last;
  };

  const filteredUsers = users?.filter(user => 
    `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.label.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const selectedUser = users?.find(user => user.id === localFilters.user);
  const selectedCategory = categories.find(cat => cat.value === localFilters.category);

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
                User: {selectedUser?.first_name || 'Unknown'}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer hover:text-blue-600"
                  onClick={() => setLocalFilters(prev => ({ ...prev, user: null }))}
                />
              </Badge>
            )}
            {localFilters.category && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                <FolderOpen className="h-3 w-3 mr-1" />
                Category: {selectedCategory?.label}
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
          <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={userSearchOpen}
                className="w-full justify-between border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              >
                {selectedUser ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(selectedUser.first_name, selectedUser.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedUser.first_name} {selectedUser.last_name}</span>
                    <Badge className={`text-xs px-2 py-0.5 ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role}
                    </Badge>
                  </div>
                ) : (
                  "All users"
                )}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput placeholder="Search users..." value={userSearch} onValueChange={setUserSearch} />
                <CommandList>
                  <CommandEmpty>No users found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        setLocalFilters(prev => ({ ...prev, user: null }));
                        setUserSearchOpen(false);
                      }}
                    >
                      All users
                    </CommandItem>
                    {filteredUsers?.map(user => (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={() => {
                          setLocalFilters(prev => ({ ...prev, user: user.id }));
                          setUserSearchOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getInitials(user.first_name, user.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1">{user.first_name} {user.last_name}</span>
                          <Badge className={`text-xs px-2 py-0.5 ${getRoleColor(user.role)}`}>
                            {user.role}
                          </Badge>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
          <Popover open={categorySearchOpen} onOpenChange={setCategorySearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={categorySearchOpen}
                className="w-full justify-between border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              >
                {selectedCategory ? (
                  <div className="flex items-center gap-2">
                    <selectedCategory.icon className={`h-4 w-4 ${selectedCategory.color}`} />
                    <span>{selectedCategory.label}</span>
                  </div>
                ) : (
                  "All categories"
                )}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput placeholder="Search categories..." value={categorySearch} onValueChange={setCategorySearch} />
                <CommandList>
                  <CommandEmpty>No categories found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        setLocalFilters(prev => ({ ...prev, category: null }));
                        setCategorySearchOpen(false);
                      }}
                    >
                      All categories
                    </CommandItem>
                    {filteredCategories.map(category => (
                      <CommandItem
                        key={category.value}
                        value={category.value}
                        onSelect={() => {
                          setLocalFilters(prev => ({ ...prev, category: category.value }));
                          setCategorySearchOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <category.icon className={`h-4 w-4 ${category.color}`} />
                          <span>{category.label}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
