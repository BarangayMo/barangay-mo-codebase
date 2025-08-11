
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Copy, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useRbiForms } from "@/hooks/use-rbi-forms";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const RbiFormsSection = () => {
  const { rbiForms, isLoading, error } = useRbiForms();
  const { toast } = useToast();

  const handleCopyRbiNumber = async (rbiNumber: string) => {
    try {
      await navigator.clipboard.writeText(rbiNumber);
      toast({
        title: "Copied!",
        description: "RBI number copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy RBI number",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-4 h-4" />;
      case 'reviewed':
        return <CheckCircle className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            RBI Forms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            RBI Forms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          RBI Forms
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rbiForms.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No RBI forms submitted yet</p>
            <Button asChild>
              <Link to="/rbi-registration">Submit RBI Form</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rbiForms.map((form) => (
              <div
                key={form.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex-1 min-w-0">
                    {form.rbi_number ? (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono font-semibold text-lg text-blue-600 break-all">
                          {form.rbi_number}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyRbiNumber(form.rbi_number!)}
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <Copy className="w-4 h-4 text-gray-500" />
                        </Button>
                      </div>
                    ) : (
                      <div className="mb-2">
                        <span className="text-gray-500 text-sm">RBI Number: Pending</span>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Submitted: {format(new Date(form.submitted_at), 'MMM dd, yyyy')}</span>
                      </div>
                      {form.reviewed_at && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Reviewed: {format(new Date(form.reviewed_at), 'MMM dd, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Badge className={`${getStatusColor(form.status)} flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap`}>
                      {getStatusIcon(form.status)}
                      <span className="capitalize">{form.status}</span>
                    </Badge>
                  </div>
                </div>

                {form.status === 'submitted' && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    <p>Your RBI form is being processed. You will be notified once reviewed.</p>
                  </div>
                )}

                {form.status === 'approved' && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    <p>Your RBI form has been approved and processed successfully.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RbiFormsSection;
