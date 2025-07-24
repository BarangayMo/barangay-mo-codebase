import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, Home, GraduationCap, Heart, Users, FileText, AlertTriangle } from "lucide-react";
import { PersonalDetailsForm } from "@/components/rbi/PersonalDetailsForm";
import { AddressDetailsForm } from "@/components/rbi/AddressDetailsForm";
import { EducationDetailsForm } from "@/components/rbi/EducationDetailsForm";
import { HealthDetailsForm } from "@/components/rbi/HealthDetailsForm";
import { ParentDetailsForm } from "@/components/rbi/ParentDetailsForm";
import { ParentStatusForm } from "@/components/rbi/ParentStatusForm";
import { BeneficiaryDetailsForm } from "@/components/rbi/BeneficiaryDetailsForm";
import { HousingDetailsForm } from "@/components/rbi/HousingDetailsForm";
import { OtherDetailsForm } from "@/components/rbi/OtherDetailsForm";
import { RbiReview } from "@/components/rbi/RbiReview";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  { id: 'personal', title: 'Personal Information', icon: User },
  { id: 'address', title: 'Address Details', icon: Home },
  { id: 'education', title: 'Education Details', icon: GraduationCap },
  { id: 'health', title: 'Health Details', icon: Heart },
  { id: 'parents', title: 'Parent Details', icon: Users },
  { id: 'parentStatus', title: 'Parent Status', icon: Users },
  { id: 'beneficiary', title: 'Beneficiary Details', icon: FileText },
  { id: 'housing', title: 'Housing Details', icon: Home },
  { id: 'other', title: 'Other Details', icon: FileText },
  { id: 'review', title: 'Review & Submit', icon: CheckCircle }
];

export default function RbiRegistration() {
  const navigate = useNavigate();
  const { user, setRbiCompleted } = useAuth();
  const { profile } = useUserProfile();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [personalDetails, setPersonalDetails] = useState({});
  const [addressDetails, setAddressDetails] = useState({});
  const [educationDetails, setEducationDetails] = useState({});
  const [healthDetails, setHealthDetails] = useState({});
  const [parentDetails, setParentDetails] = useState({});
  const [parentStatus, setParentStatus] = useState({});
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({});
  const [housingDetails, setHousingDetails] = useState({});
  const [otherDetails, setOtherDetails] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalDetailsForm onChange={setPersonalDetails} />;
      case 1:
        return <AddressDetailsForm onChange={setAddressDetails} />;
      case 2:
        return <EducationDetailsForm onChange={setEducationDetails} />;
      case 3:
        return <HealthDetailsForm onChange={setHealthDetails} />;
      case 4:
        return <ParentDetailsForm onChange={setParentDetails} />;
      case 5:
        return <ParentStatusForm onChange={setParentStatus} />;
      case 6:
        return <BeneficiaryDetailsForm onChange={setBeneficiaryDetails} />;
      case 7:
        return <HousingDetailsForm onChange={setHousingDetails} />;
      case 8:
        return <OtherDetailsForm onChange={setOtherDetails} />;
      case 9:
        return <RbiReview
          personalDetails={personalDetails}
          addressDetails={addressDetails}
          educationDetails={educationDetails}
          healthDetails={healthDetails}
          parentDetails={parentDetails}
          parentStatus={parentStatus}
          beneficiaryDetails={beneficiaryDetails}
          housingDetails={housingDetails}
          otherDetails={otherDetails}
        />;
      default:
        return <div>Not Found</div>;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit the form",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = {
        personalDetails,
        addressDetails,
        educationDetails,
        healthDetails,
        parentDetails,
        parentStatus,
        beneficiaryDetails,
        housingDetails,
        otherDetails
      };

      const { data, error } = await supabase
        .from('rbi_forms')
        .insert({
          user_id: user.id,
          form_data: formData,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          barangay_id: profile?.barangay || 'unknown'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Mark RBI as completed
      setRbiCompleted(true);

      toast({
        title: "Success!",
        description: "Your RBI form has been submitted successfully.",
        variant: "default",
      });

      // Navigate to resident profile with success state
      navigate('/resident-profile', { 
        state: { 
          showSuccess: true, 
          rbiNumber: data.rbi_number 
        } 
      });

    } catch (error) {
      console.error('Error submitting RBI form:', error);
      toast({
        title: "Error",
        description: "Failed to submit the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resident Basic Information (RBI) Form</h1>
          <p className="text-gray-600">Complete your resident profile to access barangay services</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span>{currentStep + 1} of {steps.length}</span>
                  </div>
                  <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-2 rounded-lg text-sm ${
                          index === currentStep
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : index < currentStep
                            ? 'bg-green-50 text-green-700'
                            : 'text-gray-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="truncate">{step.title}</span>
                        {index < currentStep && (
                          <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {React.createElement(steps[currentStep].icon, { className: "w-5 h-5" })}
                      {steps[currentStep].title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Step {currentStep + 1} of {steps.length}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {renderCurrentStep()}
                
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>
                  {currentStep === steps.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Form"}
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>
                      Next
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
