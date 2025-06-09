
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Shield, Loader2 } from "lucide-react";
import { useCreateInvitation } from "@/hooks/use-users-data";

interface InviteUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteUsersModal = ({ isOpen, onClose }: InviteUsersModalProps) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<'resident' | 'official' | ''>("");
  const [message, setMessage] = useState("");

  const createInvitationMutation = useCreateInvitation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !role) return;

    createInvitationMutation.mutate({
      email,
      role: role as 'resident' | 'official',
      first_name: firstName || undefined,
      last_name: lastName || undefined,
      welcome_message: message || undefined,
    }, {
      onSuccess: () => {
        // Reset form
        setEmail("");
        setFirstName("");
        setLastName("");
        setRole("");
        setMessage("");
        onClose();
      }
    });
  };

  const handleClose = () => {
    if (!createInvitationMutation.isPending) {
      setEmail("");
      setFirstName("");
      setLastName("");
      setRole("");
      setMessage("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg font-semibold">
            <Mail className="h-5 w-5 mr-2 text-blue-600" />
            Invite New User
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              disabled={createInvitationMutation.isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={createInvitationMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={createInvitationMutation.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Role *
            </Label>
            <Select 
              value={role} 
              onValueChange={(value: 'resident' | 'official') => setRole(value)} 
              required
              disabled={createInvitationMutation.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resident">Resident</SelectItem>
                <SelectItem value="official">Official</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Welcome Message (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Add a personal welcome message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              disabled={createInvitationMutation.isPending}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={createInvitationMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!email || !role || createInvitationMutation.isPending}
            >
              {createInvitationMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Send Invite
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
