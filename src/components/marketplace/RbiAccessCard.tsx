import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRbiForms } from "@/hooks/use-rbi-forms";
import { Skeleton } from "@/components/ui/skeleton";

export const RbiAccessCard = () => {
  const { user, userRole } = useAuth();
  const { rbiForms, isLoading } = useRbiForms();

  // Only show for residents
  if (userRole !== 'resident') return null;

  if (isLoading) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestForm = rbiForms?.[0];
  const hasSubmittedForm = !!latestForm;
  const isPending = latestForm?.status === 'submitted';
  const isApproved = latestForm?.status === 'approved';

  // If approved, don't show the card
  if (isApproved) return null;

  return (
    <Card className={`border-2 mb-6 ${hasSubmittedForm ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <div className={`p-2 sm:p-3 rounded-full w-fit ${hasSubmittedForm ? 'bg-blue-100' : 'bg-red-100'}`}>
            {hasSubmittedForm ? (
              <Clock className={`h-5 w-5 sm:h-6 sm:w-6 ${isPending ? 'text-blue-600' : 'text-green-600'}`} />
            ) : (
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={`font-semibold text-base sm:text-lg ${hasSubmittedForm ? 'text-blue-800' : 'text-red-800'}`}>
              {hasSubmittedForm ? 'Registration Under Review' : 'Registration Required'}
            </h3>
            
            <p className={`mt-1 text-sm ${hasSubmittedForm ? 'text-blue-700' : 'text-red-700'}`}>
              {hasSubmittedForm ? (
                <>
                  Your Barangay Registration Form (RBI #{latestForm.rbi_number || 'Processing'}) has been submitted and is pending official approval. 
                  <strong className="block mt-2">Access to the Marketplace is restricted until an official approves your registration.</strong>
                </>
              ) : (
                <>
                  <strong>You must complete your Barangay Registration Form before accessing the Marketplace.</strong>
                  <span className="block mt-2">This helps us verify your residency and provide relevant services to legitimate residents.</span>
                </>
              )}
            </p>

            {!hasSubmittedForm && (
              <div className="mt-4">
                <Link to="/rbi-registration">
                  <Button className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto">
                    <FileText className="w-4 h-4 mr-2" />
                    Complete Registration Now
                  </Button>
                </Link>
              </div>
            )}

            {hasSubmittedForm && (
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                  <span className="font-medium text-blue-800">Status:</span>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium w-fit">
                    {isPending ? 'Pending Review' : latestForm.status}
                  </span>
                </div>
                {latestForm.rbi_number && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm mt-2">
                    <span className="font-medium text-blue-800">RBI Number:</span>
                    <span className="text-blue-700 font-mono text-xs sm:text-sm">{latestForm.rbi_number}</span>
                  </div>
                )}
                <div className="mt-3 p-2 bg-blue-200/50 rounded text-xs text-blue-800">
                  <strong>⚠️ Marketplace access is temporarily disabled</strong> until your registration is approved by an official.
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};