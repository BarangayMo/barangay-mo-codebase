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
    <Card className={`border-2 ${hasSubmittedForm ? 'border-blue-200 bg-blue-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-full ${hasSubmittedForm ? 'bg-blue-100' : 'bg-orange-100'}`}>
            {hasSubmittedForm ? (
              <Clock className={`h-6 w-6 ${isPending ? 'text-blue-600' : 'text-green-600'}`} />
            ) : (
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${hasSubmittedForm ? 'text-blue-800' : 'text-orange-800'}`}>
              {hasSubmittedForm ? 'Registration Under Review' : 'Complete Your Registration'}
            </h3>
            
            <p className={`mt-1 text-sm ${hasSubmittedForm ? 'text-blue-700' : 'text-orange-700'}`}>
              {hasSubmittedForm ? (
                <>
                  Your Barangay Registration Form (RBI #{latestForm.rbi_number || 'Processing'}) has been submitted and is pending official approval. 
                  You'll be able to access the Marketplace once an official approves your registration.
                </>
              ) : (
                'You must complete your Barangay Registration Form before accessing the Marketplace. This helps us verify your residency and provide relevant services.'
              )}
            </p>

            {!hasSubmittedForm && (
              <div className="mt-4">
                <Link to="/rbi-registration">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Complete Registration
                  </Button>
                </Link>
              </div>
            )}

            {hasSubmittedForm && (
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-blue-800">Status:</span>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                    {isPending ? 'Pending Review' : latestForm.status}
                  </span>
                </div>
                {latestForm.rbi_number && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="font-medium text-blue-800">RBI Number:</span>
                    <span className="text-blue-700 font-mono">{latestForm.rbi_number}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};