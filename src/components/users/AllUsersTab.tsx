
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, MoreHorizontal, Loader2, Users, User as UserIcon, Badge as BadgeIcon, Circle, CircleDot } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InviteUsersModal } from "./InviteUsersModal";
import { useUsers, useArchiveUser, User } from "@/hooks/use-users-data";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from 'react-router-dom';



const filterOptions = [
  { value: "All", label: "All", icon: Users },
  { value: "Resident", label: "Resident", icon: UserIcon },
  { value: "Official", label: "Official", icon: BadgeIcon },
  { value: "Online", label: "Online", icon: CircleDot },
  { value: "Offline", label: "Offline", icon: Circle },
  { value: "Archived", label: "Archived", icon: Circle },
];

export const AllUsersTab = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { data: users = [], isLoading, error } = useUsers();
  const archiveUserMutation = useArchiveUser();

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName || "";
    const last = lastName || "";
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "U";
  };
const navigate = useNavigate();


  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'official':
        return 'bg-blue-100 text-blue-800';
      case 'resident':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
   

  };

  const getStatusBadge = (status: string | null, lastLogin: string | null) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500 text-white">Online</Badge>;
      case 'archived':
        return <Badge className="bg-orange-500 text-white">Archived</Badge>;
      case 'offline':
      default:
        if (lastLogin) {
          const timeAgo = formatDistanceToNow(new Date(lastLogin), { addSuffix: true });
          return <span className="text-gray-500">{timeAgo}</span>;
        }
        return <Badge className="bg-red-500 text-white">Never</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());

  switch (selectedFilter) {
    case "All":
      return matchesSearch && user.status !== "archived";
    case "Resident":
      return matchesSearch && user.role === "resident" && user.status !== "archived";
    case "Official":
      return matchesSearch && user.role === "official" && user.status !== "archived";
    case "Online":
      return matchesSearch && user.status === "online";
    case "Offline":
      return matchesSearch && user.status === "offline";
    case "Archived":
      return matchesSearch && user.status === "archived";
    default:
      return matchesSearch;
  }
});


  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleArchiveUser = (userId: string) => {
    archiveUserMutation.mutate(userId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        Error loading users. Please try again.
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Company users</h2>
        
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {filterOptions.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <Button
                key={filter.value}
                variant={selectedFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.value)}
                className={`rounded-full flex items-center gap-2 ${
                  selectedFilter === filter.value 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-12 px-6 py-3 text-left">
                  <Checkbox 
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last login
                </th>
                <th className="w-12 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                          {getInitials(user.first_name, user.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getRoleBadgeColor(user.role || '')}>
                      {user.role === 'resident' ? 'Resident' : user.role === 'official' ? 'Official' : user.role || 'N/A'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>
                      <div>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</div>
                      {user.invited_by && (
                        <div className="text-xs text-gray-400">Invited by admin</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {getStatusBadge(user.status, user.last_login)}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                       
          <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
            View Profile
          </DropdownMenuItem>
                       
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleArchiveUser(user.id)}
                          disabled={archiveUserMutation.isPending}
                        >
                          Archive User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Displaying {filteredUsers.length} users
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">1 - {filteredUsers.length}</span>
          </div>
        </div>
      </div>

      <InviteUsersModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
      />
    </div>
  );
};
