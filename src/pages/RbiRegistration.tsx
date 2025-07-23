
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, Loader2, Shield } from "lucide-react";
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
import { toast } from "sonner";

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
  const { toast: useToastHook } = useToast();
  const { user, setRbiCompleted } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingFormId, setExistingFormId] = useState<string | null>(null);
  const [existingFormStatus, setExistingFormStatus] = useState<string | null>(null);
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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Auto-save function - silent saves to reduce notification spam
  const autoSave = async (dataToSave: RbiFormData, stepToSave: number) => {
    if (!user?.id) return;
    
    setIsAutoSaving(true);
    try {
      console.log('💾 Auto-saving form data...', { step: stepToSave, data: dataToSave });
      
      // Use upsert with conflict resolution for the unique constraint
      const { error } = await supabase
        .from('rbi_draft_forms')
        .upsert({
          user_id: user.id,
          form_data: dataToSave as unknown as Json,
          last_completed_step: stepToSave
        }, {
          onConflict: 'user_id'
        });
        
      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }
      
      setLastSaved(new Date());
      console.log('✅ Auto-save successful');
      // Silent save - no toast notification to avoid spam
    } catch (error) {
      console.error("Auto-save failed:", error);
      // Dismiss any existing toasts before showing error to prevent stacking
      toast.dismiss();
      setTimeout(() => {
        toast.error('Auto-save failed', {
          description: 'Your progress may not be saved. Please try again.',
        });
      }, 100);
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Auto-save when form data changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user?.id && Object.keys(formData.personalDetails || {}).length > 0) {
        autoSave(formData, currentStep);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [formData, currentStep, user?.id]);
  
  // Load saved form data if available
  useEffect(() => {
    const loadSavedData = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          console.log('📥 Loading saved and submitted form data...');
          
          // First check for existing submitted forms
          const { data: submittedForm, error: submittedError } = await supabase
            .from('rbi_forms')
            .select('id, form_data, status, rbi_number')
            .eq('user_id', user.id)
            .order('submitted_at', { ascending: false })
            .limit(1)
            .single();

          if (submittedForm && !submittedError) {
            console.log('✅ Found existing submitted form:', submittedForm);
            setExistingFormId(submittedForm.id);
            setExistingFormStatus(submittedForm.status);
            setFormData(submittedForm.form_data as unknown as RbiFormData);
            setCurrentStep(9); // Go to review page
            setLastSaved(new Date());
            
            toast.dismiss();
            setTimeout(() => {
              toast.info('Existing Form Loaded', {
                description: `Your RBI form (${submittedForm.status}) has been loaded for editing.`,
              });
            }, 100);
          } else {
            // Try loading draft form
            const { data: draftData, error: draftError } = await supabase
              .from('rbi_draft_forms')
              .select('form_data, last_completed_step')
              .eq('user_id', user.id)
              .single();
              
            if (draftData && !draftError) {
              console.log('✅ Loaded draft data:', draftData);
              setFormData(draftData.form_data as unknown as RbiFormData);
              setCurrentStep(draftData.last_completed_step || 1);
              setLastSaved(new Date());
              
              toast.dismiss();
              setTimeout(() => {
                toast.success('Draft Loaded', {
                  description: 'Your previously saved draft has been loaded.',
                });
              }, 100);
            } else if (draftError && draftError.code !== 'PGRST116') {
              console.error('Error loading saved data:', draftError);
              toast.dismiss();
              setTimeout(() => {
                toast.error('Failed to load saved data', {
                  description: 'Starting with a fresh form.',
                });
              }, 100);
            }
          }
        } catch (error) {
          console.error("Error loading saved data:", error);
          toast.dismiss();
          setTimeout(() => {
            toast.error('Failed to load saved data', {
              description: 'Starting with a fresh form.',
            });
          }, 100);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadSavedData();
  }, [user]);
  
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
        toast.error('Validation Error', {
          description: 'Please fill in all required fields before proceeding.'
        });
        return;
      }
      
      // Auto-save current progress
      autoSave(formData, currentStep + 1);
      
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
        setIsLoading(false);
      }, 300);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      // Auto-save current progress
      autoSave(formData, currentStep - 1);
      
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
        setIsLoading(false);
      }, 300);
    }
  };
  
  // Comprehensive form validation
  const validateAllRequiredFields = () => {
    let isValid = true;
    const newErrors: Record<string, any> = {};

    // Validate all required fields across all steps
    const allRequiredFields = [
      { section: "personalDetails", fields: ["firstName", "lastName"] },
      { section: "address", fields: ["street", "barangay"] },
      { section: "otherDetails", fields: ["dateOfBirth", "sex"] },
      { section: "education", fields: ["attainment"] },
      { section: "health", fields: ["hasCondition"] }
    ];

    allRequiredFields.forEach(({ section, fields }) => {
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

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Authentication Error', {
        description: 'You must be logged in to submit the form.'
      });
      return;
    }

    // Comprehensive validation before submission
    if (!validateAllRequiredFields()) {
      toast.error('Validation Error', {
        description: 'Please fill in all required fields before submitting.'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('🚀 Submitting RBI form...', { formData, existingFormId });
      
      let submitData;
      if (existingFormId) {
        // Update existing form
        const { data, error } = await supabase
          .from('rbi_forms')
          .update({
            form_data: formData as unknown as Json,
            status: 'submitted',
            barangay_id: formData.address?.barangay || user.barangay || 'Unknown',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingFormId)
          .eq('user_id', user.id) // Security check
          .select('id, rbi_number, status')
          .single();
          
        if (error) throw error;
        submitData = data;
      } else {
        // Create new form
        const { data, error } = await supabase
          .from('rbi_forms')
          .insert({
            id: crypto.randomUUID(), // Ensure unique ID
            user_id: user.id,
            form_data: formData as unknown as Json,
            status: 'submitted',
            barangay_id: formData.address?.barangay || user.barangay || 'Unknown'
          })
          .select('id, rbi_number, status')
          .single();
          
        if (error) throw error;
        submitData = data;
      }
      
      console.log('✅ Form submitted successfully:', submitData);
      
      // Clean up draft form after successful submission
      try {
        await supabase
          .from('rbi_draft_forms')
          .delete()
          .eq('user_id', user.id);
        console.log('✅ Draft form cleaned up');
      } catch (cleanupError) {
        console.warn('Draft cleanup failed:', cleanupError);
      }
      
      // Update RBI completion status in context
      if (setRbiCompleted) {
        setRbiCompleted(true);
      }
      
      const successMessage = existingFormId 
        ? 'RBI Form Updated Successfully!' 
        : 'RBI Registration Complete!';
      const description = submitData.rbi_number 
        ? `Your RBI form has been successfully ${existingFormId ? 'updated' : 'submitted'} with number: ${submitData.rbi_number}`
        : `Your RBI form has been successfully ${existingFormId ? 'updated' : 'submitted'} and is under review.`;
      
      toast.success(successMessage, { description });
      
      navigate("/resident-home", {
        state: { 
          rbiNumber: submitData.rbi_number,
          showSuccess: true 
        }
      });
    } catch (error: any) {
      console.error("Error submitting RBI form:", error);
      
      let errorMessage = 'There was an error submitting your form. Please try again.';
      if (error?.code === '23505') {
        errorMessage = 'A form with this information already exists. Please contact support.';
      }
      
      toast.error('Submission Failed', { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const currentStepData = steps.find(step => step.id === currentStep) || steps[0];
  
  return (
    <Layout>
      {isLoading && <LoadingScreen />}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-8">
        {/* Mobile-optimized header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-outfit bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent leading-tight">
                  Record of Barangay Inhabitant
                </h1>
                {existingFormStatus && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                    <Shield className="w-3 h-3" />
                    <span className="font-medium">{existingFormStatus.toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs md:text-sm font-medium px-2 md:px-3 py-1 bg-blue-50 text-blue-700 rounded-full whitespace-nowrap">
                  Step {currentStep} of {steps.length}
                </span>
                {isAutoSaving && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                  </div>
                )}
                {lastSaved && !isAutoSaving && (
                  <div className="text-xs text-green-600 hidden sm:block">
                    Saved {lastSaved.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
            
            <Progress value={progress} className="h-1.5 sm:h-2 bg-blue-100" indicatorClassName="bg-blue-600" />
            
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div className="flex-1">
                <span className="font-medium text-blue-800 text-sm md:text-base">{currentStepData.name}</span>
                <p className="text-gray-500 text-xs md:text-sm mt-1">{currentStepData.description}</p>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-blue-800 text-xs sm:text-sm md:text-base">{Math.round(progress)}% Complete</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form content */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 lg:p-8 mb-4 sm:mb-6">
          {currentStepData.component}
        </div>
        
        {/* Mobile-optimized navigation buttons */}
        <div className="flex gap-3">
          {currentStep > 1 ? (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={isAutoSaving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 h-12"
            >
              <ArrowLeft className="w-4 h-4" /> 
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Back</span>
            </Button>
          ) : (
            <Link to="/resident-home" className="flex-1 sm:flex-none">
              <Button 
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 h-12"
              >
                <ArrowLeft className="w-4 h-4" /> 
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Button>
            </Link>
          )}
          
          {currentStep < steps.length ? (
            <Button 
              onClick={handleNext} 
              disabled={isAutoSaving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 h-12"
            >
              <span>Next</span> <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || isAutoSaving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 h-12 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">
                    {existingFormId ? 'Updating...' : 'Submitting...'}
                  </span>
                  <span className="sm:hidden">Saving...</span>
                </>
              ) : (
                <>
                  <span>{existingFormId ? 'Update Form' : 'Submit Form'}</span> 
                  <Check className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
