
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
import { LoadingScreen } from "@/components/ui/loading";

// Define step types
type Step = {
  id: number;
  name: string;
  description: string;
  component: React.ReactNode;
};

export default function RbiRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Define steps with descriptions
  const steps: Step[] = [
    { 
      id: 1, 
      name: "Personal Details", 
      description: "Basic information about yourself",
      component: <PersonalDetailsForm /> 
    },
    { 
      id: 2, 
      name: "Address", 
      description: "Where you currently reside", 
      component: <AddressDetailsForm /> 
    },
    { 
      id: 3, 
      name: "Other Details", 
      description: "Additional personal information", 
      component: <OtherDetailsForm /> 
    },
    { 
      id: 4, 
      name: "Parent Details", 
      description: "Information about your parents", 
      component: <ParentDetailsForm /> 
    },
    { 
      id: 5, 
      name: "Education", 
      description: "Educational attainment and skills", 
      component: <EducationDetailsForm /> 
    },
    { 
      id: 6, 
      name: "Health Details", 
      description: "Health conditions and information", 
      component: <HealthDetailsForm /> 
    },
    { 
      id: 7, 
      name: "Housing", 
      description: "Property and residence information", 
      component: <HousingDetailsForm /> 
    },
    { 
      id: 8, 
      name: "Beneficiary Programs", 
      description: "Government assistance programs", 
      component: <BeneficiaryDetailsForm /> 
    },
    { 
      id: 9, 
      name: "Review", 
      description: "Verify your information before submission", 
      component: <RbiReview /> 
    },
  ];
  
  // Calculate progress
  const progress = (currentStep / steps.length) * 100;
  
  const handleNext = () => {
    if (currentStep < steps.length) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
        setIsLoading(false);
      }, 500);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
        setIsLoading(false);
      }, 500);
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
      {isLoading && <LoadingScreen />}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold font-outfit bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              Record of Barangay Inhabitant
            </h1>
            <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          
          <Progress value={progress} className="h-2 bg-blue-100" indicatorClassName="bg-blue-600" />
          
          <div className="flex justify-between mt-3 text-sm">
            <div>
              <span className="font-medium text-blue-800">{currentStepData.name}</span>
              <p className="text-gray-500 text-xs mt-1">{currentStepData.description}</p>
            </div>
            <span className="font-medium text-blue-800">{Math.round(progress)}% Complete</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-8 mb-6">
          {currentStepData.component}
        </div>
        
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>
          ) : (
            <Link to="/resident-home">
              <Button 
                variant="outline"
                className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
          )}
          
          {currentStep < steps.length ? (
            <Button 
              onClick={handleNext} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
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
