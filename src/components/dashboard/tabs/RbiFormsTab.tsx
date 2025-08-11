import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  FileText,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowRight,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { RbiApprovalModal } from "@/components/officials/RbiApprovalModal";

export const RbiFormsTab = () => {
  const navigate = useNavigate();
  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch recent RBI forms for dashboard overview
  const { data: recentRbiForms = [], isLoading, refetch } = useQuery({
    queryKey: ['dashboard-rbi-forms'],
    queryFn: async () => {
      // Get recent forms for dashboard overview
      const { data: forms, error: formsError } = await supabase
        .from('rbi_forms')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(1000);

      if (formsError) throw formsError;

      // Get profile data for each form
      const formsWithProfiles = await Promise.all(
        (forms || []).map(async (form) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url, barangay')
            .eq('id', form.user_id)
            .single();

          return {
            ...form,
            profiles: profile
          };
        })
      );

      return formsWithProfiles;
    }
  });

  // Get stats
  const { data: stats = { total: 0, submitted: 0, approved: 0, rejected: 0 } } = useQuery({
    queryKey: ['rbi-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rbi_forms')
        .select('status');

      if (error) throw error;

      const formStats = {
        total: data.length,
        submitted: data.filter(f => f.status === 'submitted').length,
        approved: data.filter(f => f.status === 'approved').length,
        rejected: data.filter(f => f.status === 'rejected').length,
      };

      return formStats;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'under_review': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="h-3 w-3" />;
      case 'under_review': return <AlertCircle className="h-3 w-3" />;
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      case 'rejected': return <AlertCircle className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const getReviewerTypeIcon = (reviewerType: string | null) => {
    if (reviewerType === 'superadmin') {
      return <Shield className="h-3 w-3 text-purple-600" />;
    }
    if (reviewerType === 'official') {
      return <User className="h-3 w-3 text-blue-600" />;
    }
    return null;
  };

  const handleViewDetails = (form: any) => {
    setSelectedForm(form);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
  };

  const handleApprovalSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            RBI Forms Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total Forms</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  <p className="text-sm text-gray-600">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Forms */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent RBI Forms
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/rbi-forms')}
              className="flex items-center gap-2"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentRbiForms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No RBI forms submitted yet</p>
                <p className="text-sm">Forms will appear here once residents submit them</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRbiForms.slice(0, 5).map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {form.profiles?.first_name?.[0] || 'U'}{form.profiles?.last_name?.[0] || 'N'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm flex items-center gap-2">
                          {form.rbi_number || 'Pending RBI Number'}
                          {form.reviewer_type && getReviewerTypeIcon(form.reviewer_type)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {form.profiles?.first_name || 'Unknown'} {form.profiles?.last_name || 'User'} 
                          • {form.barangay_id || form.profiles?.barangay || 'Unknown Barangay'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(form.submitted_at), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs flex items-center gap-1 ${getStatusColor(form.status)}`}>
                        {getStatusIcon(form.status)}
                        {form.status}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(form)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {recentRbiForms.length > 5 && (
                  <div className="text-center pt-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/admin/rbi-forms')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View {recentRbiForms.length - 5} more forms
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RBI Approval Modal */}
      <RbiApprovalModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        form={selectedForm}
        onSuccess={handleApprovalSuccess}
      />
    </>
  );
};