import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MediaUpload } from "@/components/ui/media-upload";
import { supabase } from "@/integrations/supabase/client";

interface LocationState {
  role: string;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
  officials?: any[];
  logoUrl?: string;
  verifiedPhoneNumber?: string;
  userRole?: 'resident' | 'official';
  registrationId?: string;
}

interface DocumentUploads {
  secretariesAppointment: string;
  secretariesGovId: string;
  brgyaptainGovId: string;
}

export default function OfficialDocuments() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;

  const [documents, setDocuments] = useState<DocumentUploads>({
    secretariesAppointment: "",
    secretariesGovId: "",
    brgyaptainGovId: ""
  });

  const [isLoading, setIsLoading] = useState(true);

  // Generate or use existing registration ID
  const [registrationId] = useState(() => {
    return locationState?.registrationId || crypto.randomUUID();
  });

  // Load existing documents on component mount
  useEffect(() => {
    const loadExistingDocuments = async () => {
      try {
        // First try to get from session storage for immediate persistence
        const sessionKey = `registration_documents_${registrationId}`;
        const sessionData = sessionStorage.getItem(sessionKey);
        
        if (sessionData) {
          const savedDocuments = JSON.parse(sessionData);
          setDocuments(savedDocuments);
          console.log('Loaded documents from session storage:', savedDocuments);
        }

        // Also try to fetch from Supabase Storage to check for uploaded files
        const { data: files, error } = await supabase.storage
          .from('official-documents')
          .list(`registration_${registrationId}`, {
            limit: 100,
            offset: 0
          });

        if (error) {
          console.error('Error fetching documents from storage:', error);
        } else if (files && files.length > 0) {
          console.log('Found files in storage:', files);
          
          // Map storage files to document types based on filename patterns
          const storageDocuments: Partial<DocumentUploads> = {};
          
          for (const file of files) {
            const { data: urlData } = supabase.storage
              .from('official-documents')
              .getPublicUrl(`registration_${registrationId}/${file.name}`);
            
            if (file.name.includes('secretaries_appointment')) {
              storageDocuments.secretariesAppointment = urlData.publicUrl;
            } else if (file.name.includes('secretaries_gov_id')) {
              storageDocuments.secretariesGovId = urlData.publicUrl;
            } else if (file.name.includes('brgy_captain_gov_id')) {
              storageDocuments.brgyaptainGovId = urlData.publicUrl;
            }
          }
          
          // Update documents with storage URLs, but don't override session storage URLs
          setDocuments(prev => ({
            secretariesAppointment: prev.secretariesAppointment || storageDocuments.secretariesAppointment || "",
            secretariesGovId: prev.secretariesGovId || storageDocuments.secretariesGovId || "",
            brgyaptainGovId: prev.brgyaptainGovId || storageDocuments.brgyaptainGovId || ""
          }));
        }
      } catch (error) {
        console.error('Error loading existing documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingDocuments();
  }, [registrationId]);

  // Save documents to session storage whenever they change
  useEffect(() => {
    const sessionKey = `registration_documents_${registrationId}`;
    sessionStorage.setItem(sessionKey, JSON.stringify(documents));
  }, [documents, registrationId]);

  const handleDocumentUpload = (field: keyof DocumentUploads, url: string) => {
    setDocuments(prev => ({ ...prev, [field]: url }));
  };

  const handleDocumentRemove = (field: keyof DocumentUploads) => {
    setDocuments(prev => ({ ...prev, [field]: "" }));
  };

  const handleNext = () => {
    navigate("/register/logo", { 
      state: { 
        ...locationState,
        documents,
        registrationId // Pass registration ID to next step
      } 
    });
  };

  const handleBack = () => {
    navigate("/register/officials", { 
      state: locationState 
    });
  };

  const getDocumentDisplayName = (field: keyof DocumentUploads) => {
    switch (field) {
      case 'secretariesAppointment':
        return 'Secretaries Appointment';
      case 'secretariesGovId':
        return 'Secretaries Gov. ID';
      case 'brgyaptainGovId':
        return 'Brgy. Captain Gov. ID';
      default:
        return '';
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="h-1 w-4/5 bg-red-600"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={handleBack} className="text-red-600 hover:text-red-700">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-red-600">Official Documents</h1>
          <div className="w-6" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading documents...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Location Info */}
            <div className="text-left">
              <div className="text-xs text-gray-600 mb-1">Location</div>
              <div className="text-sm font-medium text-gray-900">{locationState?.barangay}</div>
              <div className="text-xs text-gray-500">
                {locationState?.municipality}, {locationState?.province}
              </div>
            </div>

            {/* Document Uploads */}
            <div className="space-y-4">
              <div className="text-left">
                <div className="text-xs text-gray-600 mb-1">Required Documents</div>
                <div className="text-sm font-medium text-gray-900">Upload official documents</div>
              </div>

              {/* Secretaries Appointment */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Upload Secretaries Appointment
                </Label>
                <MediaUpload
                  value={documents.secretariesAppointment}
                  onChange={(url) => handleDocumentUpload('secretariesAppointment', url)}
                  onRemove={() => handleDocumentRemove('secretariesAppointment')}
                  accept="image/*,.pdf,.doc,.docx"
                  className="w-full"
                  bucketName="official-documents"
                  filePath={`registration_${registrationId}/secretaries_appointment`}
                />
              </div>

              {/* Secretaries Gov. ID */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Upload Secretaries Gov. ID
                </Label>
                <MediaUpload
                  value={documents.secretariesGovId}
                  onChange={(url) => handleDocumentUpload('secretariesGovId', url)}
                  onRemove={() => handleDocumentRemove('secretariesGovId')}
                  accept="image/*,.pdf"
                  className="w-full"
                  bucketName="official-documents"
                  filePath={`registration_${registrationId}/secretaries_gov_id`}
                />
              </div>

              {/* Brgy. Captain Gov. ID */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Upload Brgy. Captain Gov. ID
                </Label>
                <MediaUpload
                  value={documents.brgyaptainGovId}
                  onChange={(url) => handleDocumentUpload('brgyaptainGovId', url)}
                  onRemove={() => handleDocumentRemove('brgyaptainGovId')}
                  accept="image/*,.pdf"
                  className="w-full"
                  bucketName="official-documents"
                  filePath={`registration_${registrationId}/brgy_captain_gov_id`}
                />
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Next Button */}
        {!isLoading && (
        <div className="p-4 border-t">
          <Button
            onClick={handleNext}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-12 text-base font-medium"
          >
            NEXT
          </Button>
        </div>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="h-1 w-4/5 bg-red-600"></div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading documents...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
        <div className="p-8 max-h-[80vh] overflow-y-auto">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-red-600 mb-6 hover:text-red-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Official Documents</h1>
            <p className="text-gray-600">Upload required documents and verify information</p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Location Info */}
            <div className="text-left">
              <div className="text-xs text-gray-600 mb-1">Location</div>
              <div className="text-sm font-medium text-gray-900">{locationState?.barangay}</div>
              <div className="text-xs text-gray-500">
                {locationState?.municipality}, {locationState?.province}
              </div>
            </div>

            {/* Document Uploads */}
            <div className="space-y-4">
              <div className="text-left">
                <div className="text-xs text-gray-600 mb-1">Required Documents</div>
                <div className="text-sm font-medium text-gray-900">Upload official documents</div>
              </div>

              {/* Secretaries Appointment */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Upload Secretaries Appointment
                </Label>
                <MediaUpload
                  value={documents.secretariesAppointment}
                  onChange={(url) => handleDocumentUpload('secretariesAppointment', url)}
                  onRemove={() => handleDocumentRemove('secretariesAppointment')}
                  accept="image/*,.pdf,.doc,.docx"
                  className="w-full"
                  bucketName="official-documents"
                  filePath={`registration_${registrationId}/secretaries_appointment`}
                />
              </div>

              {/* Secretaries Gov. ID */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Upload Secretaries Gov. ID
                </Label>
                <MediaUpload
                  value={documents.secretariesGovId}
                  onChange={(url) => handleDocumentUpload('secretariesGovId', url)}
                  onRemove={() => handleDocumentRemove('secretariesGovId')}
                  accept="image/*,.pdf"
                  className="w-full"
                  bucketName="official-documents"
                  filePath={`registration_${registrationId}/secretaries_gov_id`}
                />
              </div>

              {/* Brgy. Captain Gov. ID */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Upload Brgy. Captain Gov. ID
                </Label>
                <MediaUpload
                  value={documents.brgyaptainGovId}
                  onChange={(url) => handleDocumentUpload('brgyaptainGovId', url)}
                  onRemove={() => handleDocumentRemove('brgyaptainGovId')}
                  accept="image/*,.pdf"
                  className="w-full"
                  bucketName="official-documents"
                  filePath={`registration_${registrationId}/brgy_captain_gov_id`}
                />
              </div>
            </div>
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-base font-medium mt-8"
          >
            Next
          </Button>
        </div>
        )}
      </div>
    </div>
  );
}
