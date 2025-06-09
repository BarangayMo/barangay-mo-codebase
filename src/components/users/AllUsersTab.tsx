
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InviteUsersModal } from "./InviteUsersModal";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'Resident' | 'Official';
  joinDate: string;
  lastLogin: string;
  status: 'Online' | 'Archived' | 'Never' | 'Offline';
  avatar?: string;
  invitedBy?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    email: "kaith.tolbeten@manity.io",
    fullName: "Kaith Tolbeten",
    role: "Official",
    joinDate: "07/27/2019",
    lastLogin: "5m ago",
    status: "Online",
    avatar: "",
    invitedBy: "Thomas"
  },
  {
    id: "2",
    email: "yogarasa.gandhi@manity.io",
    fullName: "Yogarasa Gandhi",
    role: "Resident",
    joinDate: "05/24/2019",
    lastLogin: "4h ago",
    status: "Offline",
    avatar: "",
    invitedBy: "Rebecca"
  },
  {
    id: "3",
    email: "igor.antonovich@gusky.com",
    fullName: "Igor Antonovich",
    role: "Official",
    joinDate: "01/01/2018",
    lastLogin: "Online",
    status: "Online",
    avatar: "",
    invitedBy: "John"
  },
  {
    id: "4",
    email: "georges.embolo@aufity.it",
    fullName: "Georges Embolo",
    role: "Resident",
    joinDate: "04/02/2019",
    lastLogin: "Archived",
    status: "Archived",
    avatar: "",
    invitedBy: "Tina"
  },
  {
    id: "5",
    email: "cecilia.pozo@melan.ai",
    fullName: "Cecilia Pozo",
    role: "Official",
    joinDate: "01/24/2018",
    lastLogin: "6d ago",
    status: "Offline",
    avatar: "",
    invitedBy: "Igor"
  }
];

const filterOptions = [
  { value: "All", label: "All", count: mockUsers.length },
  { value: "Resident", label: "Resident", count: mockUsers.filter(u => u.role === 'Resident').length },
  { value: "Official", label: "Official", count: mockUsers.filter(u => u.role === 'Official').length },
  { value: "Enabled", label: "Enabled", count: mockUsers.filter(u => u.status === 'Online').length },
  { value: "Disabled", label: "Disabled", count: 0 },
  { value: "Archived", label: "Archived", count: mockUsers.filter(u => u.status === 'Archived').length },
];

export const AllUsersTab = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'official':
        return 'bg-blue-100 text-blue-800';
      case 'resident':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Online':
        return <Badge className="bg-green-500 text-white">Online</Badge>;
      case 'Archived':
        return <Badge className="bg-orange-500 text-white">Archived</Badge>;
      case 'Never':
        return <Badge className="bg-red-500 text-white">Never</Badge>;
      default:
        return <span className="text-gray-500">{status}</span>;
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "All") return matchesSearch;
    if (selectedFilter === "Resident") return matchesSearch && user.role === "Resident";
    if (selectedFilter === "Official") return matchesSearch && user.role === "Official";
    if (selectedFilter === "Enabled") return matchesSearch && user.status === "Online";
    if (selectedFilter === "Archived") return matchesSearch && user.status === "Archived";
    return matchesSearch;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Company users</h2>
        <Button 
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Invite users
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {filterOptions.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.value)}
              className={`rounded-full ${
                selectedFilter === filter.value 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </Button>
          ))}
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
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>
                      <div>{user.joinDate}</div>
                      <div className="text-xs text-gray-400">Invited by: {user.invitedBy}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Remove User
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
            Displaying 25 out of 1721
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">1 - 25</span>
            <Button variant="outline" size="sm">
              Next
            </Button>
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
