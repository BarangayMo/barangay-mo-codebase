
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Check, X, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useMembershipRequests, useApproveMembershipRequest, MembershipRequest } from "@/hooks/use-membership-requests";
import { formatDistanceToNow } from "date-fns";

export const MembershipRequestsTable = () => {
  const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  const { data: requests = [], isLoading, error } = useMembershipRequests();
  const approveMutation = useApproveMembershipRequest();

  console.log('Membership requests data:', requests);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName || "";
    const last = lastName || "";
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "U";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
    }
  };

  const handleAction = (request: MembershipRequest, action: 'approve' | 'reject') => {
    console.log('Handle action called:', { request, action });
    setSelectedRequest(request);
    setActionType(action);
    setAdminNotes("");
    setIsDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedRequest) return;

    console.log('Confirming action:', {
      requestId: selectedRequest.id,
      approve: actionType === 'approve',
      adminNotes: adminNotes.trim() || undefined,
    });

    approveMutation.mutate({
      requestId: selectedRequest.id,
      approve: actionType === 'approve',
      adminNotes: adminNotes.trim() || undefined,
    });

    setIsDialogOpen(false);
    setSelectedRequest(null);
    setAdminNotes("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('Membership requests error:', error);
    return (
      <div className="text-center text-red-600 p-8">
        Error loading membership requests: {error.message || 'Unknown error'}
      </div>
    );
  }

  const pendingRequests = requests.filter(req => req.status === 'pending');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Membership Requests ({pendingRequests.length} pending)
        </h3>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barangay
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                          {getInitials(request.user_first_name, request.user_last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {`${request.user_first_name || ''} ${request.user_last_name || ''}`.trim() || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">{request.user_email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {request.barangay_name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <Badge className="bg-blue-100 text-blue-800">
                      {request.user_role === 'resident' ? 'Resident' : 'Official'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {formatDistanceToNow(new Date(request.requested_at), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-4">
                    {request.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAction(request, 'approve')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={approveMutation.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(request, 'reject')}
                          disabled={approveMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {request.request_message && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              alert(request.request_message);
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <span className="text-xs text-gray-400">
                          {request.reviewed_at && formatDistanceToNow(new Date(request.reviewed_at), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No membership requests found. Users can submit membership requests to appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Membership Request
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'This will approve the user\'s membership and grant them access to the platform.'
                : 'This will reject the user\'s membership request.'
              }
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                <p className="text-sm text-gray-600">
                  <strong>User:</strong> {selectedRequest.user_first_name} {selectedRequest.user_last_name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {selectedRequest.user_email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Barangay:</strong> {selectedRequest.barangay_name}
                </p>
                {selectedRequest.request_message && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600"><strong>Message:</strong></p>
                    <p className="text-sm text-gray-700 bg-white p-2 rounded border">
                      {selectedRequest.request_message}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about this decision..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAction}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={actionType === 'reject' ? 'destructive' : 'default'}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
