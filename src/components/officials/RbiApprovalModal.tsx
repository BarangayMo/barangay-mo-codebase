import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, XCircle, User, MapPin, Calendar, Phone, Mail } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface RbiForm {
  id: string;
  rbi_number: string | null;
  status: string;
  submitted_at: string;
  form_data: any;
  user_id: string;
  profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

interface RbiApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: RbiForm | null;
  onSuccess: () => void;
}

export const RbiApprovalModal = ({ isOpen, onClose, form, onSuccess }: RbiApprovalModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!form) return null;

  const handleApproval = async (approved: boolean) => {
    if (!user?.id) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('rbi_forms')
        .update({
          status: approved ? 'approved' : 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          admin_notes: notes || null
        })
        .eq('id', form.id);

      if (error) throw error;

      // Invalidate all relevant query keys to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['rbi-forms'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-rbi-forms'] });
      await queryClient.invalidateQueries({ queryKey: ['user-rbi-forms'] });
      
      toast({
        title: approved ? "Application Approved" : "Application Rejected",
        description: `RBI application ${form.rbi_number || 'pending'} has been ${approved ? 'approved' : 'rejected'}.`,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating RBI form:', error);
      toast({
        title: "Error",
        description: "Failed to process the application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const personalDetails = form.form_data?.personalDetails || {};
  const addressDetails = form.form_data?.address || {};
  const otherDetails = form.form_data?.otherDetails || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            RBI Application Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-lg">
                {personalDetails.firstName} {personalDetails.lastName}
              </h3>
              <p className="text-sm text-gray-600">RBI #{form.rbi_number}</p>
              <p className="text-xs text-gray-500">
                Submitted: {new Date(form.submitted_at).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={form.status === 'submitted' ? 'default' : 'secondary'}>
              {form.status}
            </Badge>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 border-b pb-2">Personal Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full Name:</span>
                  <span>{personalDetails.firstName} {personalDetails.middleName} {personalDetails.lastName} {personalDetails.suffix}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span>{otherDetails.dateOfBirth || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span>{otherDetails.sex || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Civil Status:</span>
                  <span>{otherDetails.civilStatus || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span>{otherDetails.contactNumber || 'N/A'}</span>
                </div>
                {otherDetails.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{otherDetails.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 border-b pb-2">Address Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">House #:</span>
                  <span>{addressDetails.houseNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Street:</span>
                  <span>{addressDetails.street || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Barangay:</span>
                  <span>{addressDetails.barangay || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zone/Purok:</span>
                  <span>{addressDetails.zone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Residence Since:</span>
                  <span>{addressDetails.residenceSince || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {(form.form_data?.education || form.form_data?.health) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {form.form_data?.education && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Education & Work</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Educational Attainment:</span>
                      <span>{form.form_data.education.attainment || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profession:</span>
                      <span>{form.form_data.education.profession || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job Status:</span>
                      <span>{form.form_data.education.jobStatus || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {form.form_data?.health && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Health Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Has Condition:</span>
                      <span>{form.form_data.health.hasCondition || 'N/A'}</span>
                    </div>
                    {form.form_data.health.condition && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <span>{form.form_data.health.condition}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes Section */}
          <div className="space-y-3">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Review Notes (Optional)
            </label>
            <Textarea
              id="notes"
              placeholder="Add any notes or comments about this application..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleApproval(false)}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={() => handleApproval(true)}
              disabled={isProcessing}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
