
import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DashboardPageHeader } from '@/components/dashboard/PageHeader';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Check, X, Mail, Phone, Calendar, User, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobApplication {
  id: string;
  job_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  cover_letter: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  application_date: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  notes: string | null;
  jobs: {
    title: string;
    company: string;
    location: string;
  };
}

const JobApplicationsPage = () => {
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch job applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['job-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            title,
            company,
            location
          )
        `)
        .order('application_date', { ascending: false });

      if (error) throw error;
      return data as JobApplication[];
    }
  });

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from('job_applications')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          notes: notes || null
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
      setIsDetailDialogOpen(false);
      setSelectedApplication(null);
      setReviewNotes('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
      console.error('Error updating application:', error);
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary', label: 'Pending' },
      reviewing: { variant: 'default', label: 'Reviewing' },
      approved: { variant: 'default', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant as any} className={
        status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''
      }>
        {config.label}
      </Badge>
    );
  };

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setReviewNotes(application.notes || '');
    setIsDetailDialogOpen(true);
  };

  const handleStatusUpdate = (status: 'approved' | 'rejected') => {
    if (!selectedApplication) return;
    
    updateStatusMutation.mutate({
      id: selectedApplication.id,
      status,
      notes: reviewNotes
    });
  };

  const columns = [
    {
      id: 'applicant_name',
      header: 'Applicant',
      cell: (application: JobApplication) => (
        <div className="flex flex-col">
          <span className="font-medium">{application.applicant_name}</span>
          <span className="text-sm text-muted-foreground">{application.applicant_email}</span>
        </div>
      )
    },
    {
      id: 'job_title',
      header: 'Job Applied For',
      cell: (application: JobApplication) => (
        <div className="flex flex-col">
          <span className="font-medium">{application.jobs?.title}</span>
          <span className="text-sm text-muted-foreground">{application.jobs?.company}</span>
        </div>
      )
    },
    {
      id: 'location',
      header: 'Location',
      cell: (application: JobApplication) => application.jobs?.location || 'N/A'
    },
    {
      id: 'application_date',
      header: 'Applied Date',
      cell: (application: JobApplication) => 
        new Date(application.application_date).toLocaleDateString()
    },
    {
      id: 'status',
      header: 'Status',
      cell: (application: JobApplication) => getStatusBadge(application.status)
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (application: JobApplication) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewDetails(application)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      )
    }
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Job Applications">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading job applications...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Job Applications">
      <div className="space-y-6">
        <DashboardPageHeader
          title="Job Applications"
          description="Manage and review job applications from candidates"
          breadcrumbItems={[
            { label: "Jobs", href: "/admin/jobs" },
            { label: "Applications" }
          ]}
        />

        <DataTable
          data={applications || []}
          columns={columns}
          showControls={true}
        />

        {/* Application Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>

            {selectedApplication && (
              <div className="space-y-6">
                {/* Applicant Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedApplication.applicant_name}</p>
                        <p className="text-sm text-muted-foreground">Applicant Name</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedApplication.applicant_email}</p>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                      </div>
                    </div>

                    {selectedApplication.applicant_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{selectedApplication.applicant_phone}</p>
                          <p className="text-sm text-muted-foreground">Phone Number</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedApplication.jobs?.title}</p>
                        <p className="text-sm text-muted-foreground">Position</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {new Date(selectedApplication.application_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Application Date</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                      {getStatusBadge(selectedApplication.status)}
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApplication.cover_letter && (
                  <div>
                    <Label className="text-base font-semibold">Cover Letter</Label>
                    <div className="mt-2 p-4 bg-muted rounded-lg">
                      <p className="text-sm leading-relaxed">{selectedApplication.cover_letter}</p>
                    </div>
                  </div>
                )}

                {/* Review Notes */}
                <div>
                  <Label htmlFor="review-notes" className="text-base font-semibold">
                    Review Notes
                  </Label>
                  <Textarea
                    id="review-notes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add your review notes here..."
                    className="mt-2"
                    rows={4}
                  />
                </div>

                {/* Action Buttons */}
                {selectedApplication.status !== 'approved' && selectedApplication.status !== 'rejected' && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => handleStatusUpdate('approved')}
                      disabled={updateStatusMutation.isPending}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Application
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={updateStatusMutation.isPending}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                )}

                {(selectedApplication.status === 'approved' || selectedApplication.status === 'rejected') && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      Application has been {selectedApplication.status}
                    </p>
                    {selectedApplication.reviewed_at && (
                      <p className="text-sm text-muted-foreground">
                        Reviewed on {new Date(selectedApplication.reviewed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default JobApplicationsPage;
