
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Badge } from './badge';
import { Search, User, Crown, Shield } from 'lucide-react';
import { useUsers } from '@/hooks/use-users-data';

interface AssigneeDialogProps {
  currentAssigneeId?: string;
  onAssigneeChange: (userId: string, user: any) => void;
  children: React.ReactNode;
}

export const AssigneeDialog = ({ currentAssigneeId, onAssigneeChange, children }: AssigneeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: users = [] } = useUsers();

  const filteredUsers = users.filter(user =>
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'official':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-yellow-100 text-yellow-800';
      case 'official':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectUser = (user: any) => {
    onAssigneeChange(user.id, user);
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Select Assignee
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors ${
                  currentAssigneeId === user.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => handleSelectUser(user)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.first_name} ${user.last_name}&background=random`} />
                  <AvatarFallback>
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    {getRoleIcon(user.role)}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                
                <Badge className={getRoleBadgeColor(user.role)}>
                  {user.role}
                </Badge>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No users found</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
