import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Eye, Clock, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useOfficialRegistrations, useApproveOfficial, useRejectOfficial } from "@/hooks/use-officials-registration";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function OfficialRegistrationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOfficial, setSelectedOfficial] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: registrations, isLoading, error } = useOfficialRegistrations(statusFilter);
  const approveOfficial = useApproveOfficial();
  const rejectOfficial = useRejectOfficial();

  // Check if user is super admin
  if (user?.role !== 'superadmin') {
    return (
      <AdminLayout title="Official Registrations">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <XCircle className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Only Super-Admins can access official registrations.</p>
        </div>
      </AdminLayout>
    );
  }

  const handleView = (official: any) => {
    setSelectedOfficial(official);
    setIsViewModalOpen(true);
  };

  const handleApprove = async (officialId: string) => {
    try {
      await approveOfficial.mutateAsync(officialId);
    } catch (error) {
      console.error('Failed to approve official:', error);
    }
  };

  const handleReject = (official: any) => {
    setSelectedOfficial(official);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedOfficial) return;

    try {
      await rejectOfficial.mutateAsync({
        officialId: selectedOfficial.id,
        reason: rejectionReason.trim() || undefined
      });
      setIsRejectModalOpen(false);
      setSelectedOfficial(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject official:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFullName = (official: any) => {
    const nameParts = [
      official.first_name,
      official.middle_name,
      official.last_name,
      official.suffix
    ].filter(Boolean);
    return nameParts.join(' ');
  };

  if (isLoading) {
    return (
      <AdminLayout title="Official Registrations">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Official Registrations</h1>
            <p className="text-gray-600">Manage barangay official registration requests</p>
          </div>
          
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Official Registrations">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <XCircle className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h1>
          <p className="text-gray-600">Failed to load official registrations. Please try again.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Official Registrations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Official Registrations</h1>
            <p className="text-gray-600">Manage barangay official registration requests</p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {registrations?.filter(r => r.status === 'pending').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {registrations?.filter(r => r.status === 'approved').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {registrations?.filter(r => r.status === 'rejected').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {registrations?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registrations List */}
        <div className="space-y-4">
          {registrations && registrations.length > 0 ? (
            registrations.map((registration) => (
              <Card key={registration.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getFullName(registration)}
                        </h3>
                        {getStatusBadge(registration.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>{registration.position}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{registration.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{registration.phone_number}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{registration.barangay}, {registration.municipality}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Submitted: {formatDate(registration.submitted_at!)}</span>
                        </div>
                      </div>
                    </div>

                   <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
  <Button
    variant="outline"
    size="sm"
    onClick={() => handleView(registration)}
  >
    <Eye className="h-4 w-4 mr-1" />
    View
  </Button>

  {registration.status === 'pending' && (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => handleApprove(registration.id)}
        disabled={approveOfficial.isPending}
      >
        Approve
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleReject(registration)}
        disabled={rejectOfficial.isPending}
      >
        <XCircle className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </>
  )}
</div>

                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
                <p className="text-gray-600">
                  {statusFilter === 'all' 
                    ? 'No official registrations have been submitted yet.'
                    : `No ${statusFilter} registrations found.`
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Official Registration Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedOfficial && getFullName(selectedOfficial)}
              </DialogDescription>
            </DialogHeader>
            
            {selectedOfficial && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedOfficial.status)}
                    </div>
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input value={selectedOfficial.position} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input value={selectedOfficial.first_name} readOnly />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input value={selectedOfficial.last_name} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Middle Name</Label>
                    <Input value={selectedOfficial.middle_name || ''} readOnly />
                  </div>
                  <div>
                    <Label>Suffix</Label>
                    <Input value={selectedOfficial.suffix || ''} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input value={selectedOfficial.email} readOnly />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input value={selectedOfficial.phone_number} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Landline Number</Label>
                    <Input value={selectedOfficial.landline_number || ''} readOnly />
                  </div>
                  <div>
                    <Label>Barangay</Label>
                    <Input value={selectedOfficial.barangay} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Municipality</Label>
                    <Input value={selectedOfficial.municipality} readOnly />
                  </div>
                  <div>
                    <Label>Province</Label>
                    <Input value={selectedOfficial.province} readOnly />
                  </div>
                </div>

                <div>
                  <Label>Region</Label>
                  <Input value={selectedOfficial.region} readOnly />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Submitted At</Label>
                    <Input value={formatDate(selectedOfficial.submitted_at)} readOnly />
                  </div>
                  {selectedOfficial.approved_at && (
                    <div>
                      <Label>Approved At</Label>
                      <Input value={formatDate(selectedOfficial.approved_at)} readOnly />
                    </div>
                  )}
                </div>

                {selectedOfficial.rejection_reason && (
                  <div>
                    <Label>Rejection Reason</Label>
                    <Textarea value={selectedOfficial.rejection_reason} readOnly />
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Modal */}
        <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Registration</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject the registration for {selectedOfficial && getFullName(selectedOfficial)}?
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejection-reason">Rejection Reason (Optional)</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Provide a reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRejectConfirm}
                disabled={rejectOfficial.isPending}
              >
                {rejectOfficial.isPending ? 'Rejecting...' : 'Reject Registration'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
