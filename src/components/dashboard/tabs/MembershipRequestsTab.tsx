
import { useMembershipRequests } from "@/hooks/use-dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateWithIcon } from "@/components/dashboard/EmptyStateWithIcon";
import { UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export const MembershipRequestsTab = () => {
  const { data: requests, isLoading, error } = useMembershipRequests();

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
        icon={<UserPlus className="h-8 w-8 text-gray-400" />}
        title="Unable to Load Requests"
        description="There was an error loading membership requests. Please try again later."
      />
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <EmptyStateWithIcon
        icon={<UserPlus className="h-8 w-8 text-gray-400" />}
        title="No Membership Requests"
        description="No membership requests have been submitted yet. Requests will appear here when users apply to join barangays."
      />
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Barangay</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">
                {request.profiles?.first_name || request.profiles?.last_name 
                  ? `${request.profiles.first_name || ''} ${request.profiles.last_name || ''}`.trim()
                  : 'Unknown User'
                }
              </TableCell>
              <TableCell className="text-gray-600">
                {request.barangay_name}
              </TableCell>
              <TableCell className="text-gray-600 max-w-xs truncate">
                {request.request_message || 'No message'}
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(request.status)}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">
                {formatDistanceToNow(new Date(request.requested_at), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
