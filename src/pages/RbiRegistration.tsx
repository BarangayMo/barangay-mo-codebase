
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PersonalDetailsForm from "@/components/rbi/PersonalDetailsForm";
import AddressDetailsForm from "@/components/rbi/AddressDetailsForm";
import OtherDetailsForm from "@/components/rbi/OtherDetailsForm";
import ParentDetailsForm from "@/components/rbi/ParentDetailsForm";
import EducationDetailsForm from "@/components/rbi/EducationDetailsForm";
import HealthDetailsForm from "@/components/rbi/HealthDetailsForm";
import HousingDetailsForm from "@/components/rbi/HousingDetailsForm";
import BeneficiaryDetailsForm from "@/components/rbi/BeneficiaryDetailsForm";
import RbiReview from "@/components/rbi/RbiReview";

// Define step types
type Step = {
  id: number;
  name: string;
  component: React.ReactNode;
};

export default function RbiRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define steps
  const steps: Step[] = [
    { id: 1, name: "Personal Details", component: <PersonalDetailsForm /> },
    { id: 2, name: "Address", component: <AddressDetailsForm /> },
    { id: 3, name: "Other Details", component: <OtherDetailsForm /> },
    { id: 4, name: "Parent Details", component: <ParentDetailsForm /> },
    { id: 5, name: "Education", component: <EducationDetailsForm /> },
    { id: 6, name: "Health Details", component: <HealthDetailsForm /> },
    { id: 7, name: "Housing", component: <HousingDetailsForm /> },
    { id: 8, name: "Beneficiary Programs", component: <BeneficiaryDetailsForm /> },
    { id: 9, name: "Review", component: <RbiReview /> },
  ];
  
  // Calculate progress
  const progress = (currentStep / steps.length) * 100;
  
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "RBI Registration Complete",
        description: "Your information has been successfully submitted.",
      });
      navigate("/resident-profile");
    }, 2000);
  };
  
  const currentStepData = steps.find(step => step.id === currentStep) || steps[0];
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold font-outfit">
              Record of Barangay Inhabitant
            </h1>
            <span className="text-sm text-gray-500 font-medium">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{currentStepData.name}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {currentStepData.component}
        </div>
        
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>
          ) : (
            <Link to="/resident-home">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
          )}
          
          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="flex items-center gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit <Check className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
