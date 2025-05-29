
import { useMembershipRequests } from "@/hooks/use-dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateWithIcon } from "@/components/dashboard/EmptyStateWithIcon";
import { UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Barangay</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Message</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Requested</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">
                    {request.profiles?.first_name || request.profiles?.last_name 
                      ? `${request.profiles.first_name || ''} ${request.profiles.last_name || ''}`.trim()
                      : 'Unknown User'
                    }
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {request.barangay_name}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                  {request.request_message || 'No message'}
                </td>
                <td className="py-3 px-4">
                  <Badge className={getStatusBadgeColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {formatDistanceToNow(new Date(request.requested_at), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
