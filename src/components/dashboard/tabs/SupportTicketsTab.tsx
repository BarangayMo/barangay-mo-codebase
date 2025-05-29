
import { useSupportTickets } from "@/hooks/use-dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateWithIcon } from "@/components/dashboard/EmptyStateWithIcon";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export const SupportTicketsTab = () => {
  const { data: tickets, isLoading, error } = useSupportTickets();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyStateWithIcon
        icon={<MessageSquare className="h-8 w-8 text-gray-400" />}
        title="Unable to Load Tickets"
        description="There was an error loading support tickets. Please try again later."
      />
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <EmptyStateWithIcon
        icon={<MessageSquare className="h-8 w-8 text-gray-400" />}
        title="No Support Tickets"
        description="No support tickets have been created yet. Tickets will appear here when users need assistance."
      />
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">{ticket.title}</TableCell>
              <TableCell className="text-gray-600">
                {ticket.profiles?.first_name || ticket.profiles?.last_name 
                  ? `${ticket.profiles.first_name || ''} ${ticket.profiles.last_name || ''}`.trim()
                  : 'Unknown User'
                }
              </TableCell>
              <TableCell className="text-gray-600">
                {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
              </TableCell>
              <TableCell>
                <Badge className={getPriorityBadgeColor(ticket.priority)}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(ticket.status)}>
                  {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">
                {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
