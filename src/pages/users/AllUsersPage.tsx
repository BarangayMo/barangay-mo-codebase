
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, MoreHorizontal, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InviteUserDialog } from "@/components/users/InviteUserDialog";
import { UserStatusFilters } from "@/components/users/UserStatusFilters";

const AllUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock data - replace with actual API call
  const users = [
    {
      id: "1",
      email: "keith.tolbeten@manity.io",
      fullName: "Keith Tolbeten",
      role: "HR Lead",
      joinedDate: "07/27/2019",
      invitedBy: "Thomas",
      lastLogin: "5m ago",
      status: "active",
      avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png"
    },
    {
      id: "2",
      email: "yogarasa.gandhi@manity.io",
      fullName: "Yogarasa Gandhi",
      role: "Account Manager",
      joinedDate: "05/24/2019",
      invitedBy: "Rebecca",
      lastLogin: "4h ago",
      status: "active",
      avatar: ""
    },
    {
      id: "3",
      email: "igor.antonovich@gusky.com",
      fullName: "Igor Antonovich",
      role: "HR Director",
      joinedDate: "01/01/2018",
      invitedBy: "John",
      lastLogin: "Online",
      status: "online",
      avatar: ""
    },
    {
      id: "4",
      email: "georges.embolo@aufity.it",
      fullName: "Georges Embolo",
      role: "HR Manager",
      joinedDate: "04/02/2019",
      invitedBy: "Tina",
      lastLogin: "Archived",
      status: "archived",
      avatar: ""
    },
    {
      id: "5",
      email: "cecilia.pozo@melan.ai",
      fullName: "Cecilia Pozo",
      role: "Head of HR",
      joinedDate: "01/24/2018",
      invitedBy: "Igor",
      lastLogin: "6d ago",
      status: "active",
      avatar: ""
    }
  ];

  const getStatusBadge = (status: string, lastLogin: string) => {
    if (status === "online") {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Online</Badge>;
    }
    if (status === "archived") {
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Archived</Badge>;
    }
    if (lastLogin === "Never") {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Never</Badge>;
    }
    return null;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "invited") return matchesSearch && user.status === "invited";
    if (activeFilter === "enabled") return matchesSearch && user.status === "active";
    if (activeFilter === "disabled") return matchesSearch && user.status === "disabled";
    if (activeFilter === "archived") return matchesSearch && user.status === "archived";
    
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
    <AdminLayout title="All Users">
      <DashboardPageHeader
        title="Company users"
        breadcrumbItems={[
          { label: "Users", href: "/admin/users" },
          { label: "All Users" }
        ]}
        actionButton={{
          label: "Invite users",
          onClick: () => setIsInviteDialogOpen(true),
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <UserStatusFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-medium">E-mail</TableHead>
                  <TableHead className="font-medium">Full name</TableHead>
                  <TableHead className="font-medium">Role</TableHead>
                  <TableHead className="font-medium">Joined</TableHead>
                  <TableHead className="font-medium">Last login</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.fullName} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                            {user.fullName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{user.joinedDate}</span>
                        <span className="text-xs text-gray-500">Invited by: {user.invitedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(user.status, user.lastLogin) || (
                          <span className="text-sm">{user.lastLogin}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit user</DropdownMenuItem>
                          <DropdownMenuItem>Change role</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove user</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>Displaying {filteredUsers.length} out of {users.length}</span>
            <div className="flex items-center gap-2">
              <span>1 - {Math.min(25, filteredUsers.length)}</span>
              <Button variant="outline" size="sm" disabled>
                ←
              </Button>
              <Button variant="outline" size="sm">
                →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <InviteUserDialog 
        open={isInviteDialogOpen} 
        onOpenChange={setIsInviteDialogOpen}
      />
    </AdminLayout>
  );
};

export default AllUsersPage;
