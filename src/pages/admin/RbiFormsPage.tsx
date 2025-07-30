import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  MoreVertical,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { RbiApprovalModal } from "@/components/officials/RbiApprovalModal";
import { AdminLayout } from "@/components/layout/AdminLayout";

const RbiFormsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [barangayFilter, setBarangayFilter] = useState("all");
  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all RBI forms (super admin can see all)
  const { data: rbiForms = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-rbi-forms', searchQuery, statusFilter, barangayFilter],
    queryFn: async () => {
      // First get the RBI forms
      let query = supabase
        .from('rbi_forms')
        .select('*')
        .order('submitted_at', { ascending: false });

      // Apply filters
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter as any);
      }
      
      if (barangayFilter !== "all") {
        query = query.eq('barangay_id', barangayFilter);
      }

      const { data: forms, error: formsError } = await query;
      
      if (formsError) throw formsError;

      // Then get the profile data for each form
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
    },
    enabled: !!user?.id
  });

  // Get unique barangays for filter
  const { data: barangays = [] } = useQuery({
    queryKey: ['rbi-barangays'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rbi_forms')
        .select('barangay_id')
        .not('barangay_id', 'is', null);
      
      if (error) throw error;
      
      const uniqueBarangays = [...new Set(data.map(item => item.barangay_id))];
      return uniqueBarangays.filter(Boolean);
    }
  });

  // Filter forms based on search
  const filteredForms = rbiForms.filter(form => {
    const matchesSearch = searchQuery === "" || 
      form.rbi_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${form.profiles?.first_name || ''} ${form.profiles?.last_name || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.barangay_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Get stats
  const stats = {
    total: rbiForms.length,
    submitted: rbiForms.filter(f => f.status === 'submitted').length,
    under_review: rbiForms.filter(f => f.status === 'under_review').length,
    approved: rbiForms.filter(f => f.status === 'approved').length,
    rejected: rbiForms.filter(f => f.status === 'rejected').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'under_review': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'pending_documents': return 'bg-orange-100 text-orange-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4" />;
      case 'under_review': return <AlertCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      case 'pending_documents': return <FileText className="h-4 w-4" />;
      case 'draft': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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

  return (
    <AdminLayout title="RBI Forms Management">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                  <p className="text-sm text-gray-600">Submitted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{stats.under_review}</p>
                  <p className="text-sm text-gray-600">Under Review</p>
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

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by RBI number, resident name, or barangay..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All Status
                </Button>
                <Button
                  variant={statusFilter === "submitted" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("submitted")}
                >
                  Submitted
                </Button>
                <Button
                  variant={statusFilter === "under_review" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("under_review")}
                >
                  Under Review
                </Button>
                <Button
                  variant={statusFilter === "approved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("approved")}
                >
                  Approved
                </Button>
              </div>

              <div className="flex gap-2">
                <select
                  value={barangayFilter}
                  onChange={(e) => setBarangayFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Barangays</option>
                  {barangays.map((barangay) => (
                    <option key={barangay} value={barangay}>
                      {barangay}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RBI Forms List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">RBI Forms ({filteredForms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : filteredForms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No RBI forms found</p>
                <p className="text-sm">
                  {searchQuery || statusFilter !== "all" || barangayFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "RBI forms will appear here once residents submit them"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredForms.map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm">
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
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>Submitted {format(new Date(form.submitted_at), 'MMM dd, yyyy')}</span>
                          <span>•</span>
                          <span className="font-medium">{form.barangay_id || form.profiles?.barangay || 'Unknown Barangay'}</span>
                          {form.reviewer_type && (
                            <>
                              <span>•</span>
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                Reviewed by {form.reviewer_type === 'superadmin' ? 'Super Admin' : 'Official'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs flex items-center gap-1 ${getStatusColor(form.status)}`}>
                        {getStatusIcon(form.status)}
                        {form.status}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(form)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review Application
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
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
    </AdminLayout>
  );
};

export default RbiFormsPage;