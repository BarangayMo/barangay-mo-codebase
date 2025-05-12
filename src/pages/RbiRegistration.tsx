
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, Loader2, Save } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RbiFormData } from "@/types/rbi";
import { Json } from "@/integrations/supabase/types";

// Define step types
type Step = {
  id: number;
  name: string;
  description: string;
  component: React.ReactNode;
  requiredFields: { section: string; fields: string[] }[];
};

export default function RbiRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RbiFormData>({
    personalDetails: {},
    address: {},
    otherDetails: {},
    parentDetails: {},
    education: {},
    health: {},
    housing: {},
    beneficiary: {}
  });
  const [errors, setErrors] = useState<Record<string, any>>({});
  
  // Load saved form data if available
  useEffect(() => {
    const loadSavedData = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('rbi_draft_forms')
            .select('form_data, last_completed_step')
            .eq('user_id', user.id)
            .single();
            
          if (data && !error) {
            // Cast the JSON data to RbiFormData type
            setFormData(data.form_data as unknown as RbiFormData);
            setCurrentStep(data.last_completed_step || 1);
            toast({
              title: "Form Data Loaded",
              description: "Your previously saved information has been loaded.",
            });
          }
        } catch (error) {
          console.error("Error loading saved data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadSavedData();
  }, [user, toast]);
  
  // Define steps with descriptions and required fields
  const steps: Step[] = [
    { 
      id: 1, 
      name: "Personal Details", 
      description: "Basic information about yourself",
      component: <PersonalDetailsForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />,
      requiredFields: [{ section: "personalDetails", fields: ["firstName", "lastName"] }]
    },
    { 
      id: 2, 
      name: "Address", 
      description: "Where you currently reside", 
      component: <AddressDetailsForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />,
      requiredFields: [{ section: "address", fields: ["street", "barangay"] }]
    },
    { 
      id: 3, 
      name: "Other Details", 
      description: "Additional personal information", 
      component: <OtherDetailsForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />,
      requiredFields: [{ section: "otherDetails", fields: ["dateOfBirth", "sex"] }]
    },
    { 
      id: 4, 
      name: "Parent Details", 
      description: "Information about your parents", 
      component: <ParentDetailsForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />,
      requiredFields: []  // Not requiring parent details
    },
    { 
      id: 5, 
      name: "Education", 
      description: "Educational attainment and skills", 
      component: <EducationDetailsForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />,
      requiredFields: [{ section: "education", fields: ["attainment"] }]
    },
    { 
      id: 6, 
      name: "Health Details", 
      description: "Health conditions and information", 
      component: <HealthDetailsForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />,
      requiredFields: [{ section: "health", fields: ["hasCondition"] }]
    },
    { 
      id: 7, 
      name: "Housing", 
      description: "Property and residence information", 
      component: <HousingDetailsForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />,
      requiredFields: []  // Not requiring housing details
    },
    { 
      id: 8, 
      name: "Beneficiary Programs", 
      description: "Government assistance programs", 
      component: <BeneficiaryDetailsForm formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />,
      requiredFields: []  // Not requiring beneficiary details
    },
    { 
      id: 9, 
      name: "Review", 
      description: "Verify your information before submission", 
      component: <RbiReview formData={formData} />,
      requiredFields: []  // No validation on review page
    },
  ];
  
  // Calculate progress
  const progress = (currentStep / steps.length) * 100;
  
  // Validate the current step
  const validateStep = () => {
    const currentStepData = steps.find(step => step.id === currentStep);
    if (!currentStepData || !currentStepData.requiredFields.length) return true;
    
    let isValid = true;
    const newErrors = { ...errors };
    
    currentStepData.requiredFields.forEach(({ section, fields }) => {
      fields.forEach(field => {
        if (!formData[section] || !formData[section][field]) {
          isValid = false;
          if (!newErrors[section]) newErrors[section] = {};
          newErrors[section][field] = "This field is required";
        }
      });
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (currentStep < steps.length) {
      // Validate before proceeding
      if (!validateStep()) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive"
        });
        return;
      }
      
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
  
  const handleSaveForLater = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please login to save your progress.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('rbi_draft_forms')
        .upsert({
          user_id: user.id,
          form_data: formData as unknown as Json,
          last_completed_step: currentStep
        });
        
      if (error) throw error;
      
      toast({
        title: "Progress Saved",
        description: "You can continue filling the form later.",
      });
      
      navigate("/resident-home");
    } catch (error) {
      console.error("Error saving form:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
          <div className="flex gap-2">
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
            
            <Button 
              variant="outline" 
              onClick={handleSaveForLater}
              disabled={isSaving}
              className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save for Later
                </>
              )}
            </Button>
          </div>
          
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
