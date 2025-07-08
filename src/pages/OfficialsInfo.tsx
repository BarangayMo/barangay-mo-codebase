
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Edit2, Phone, User } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RegistrationProgress } from "@/components/ui/registration-progress";
import { OfficialDetailsModal } from "@/components/officials/OfficialDetailsModal";
import { supabase } from "@/integrations/supabase/client";

interface LocationState {
  role: string;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
}

interface OfficialData {
  position: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  isCompleted: boolean;
}

const STANDARD_POSITIONS = [
  "Punong Barangay",
  "Barangay Secretary",  
  "Barangay Treasurer",
  "Sangguniang Barangay Member",
  "Sangguniang Barangay Member",
  "Sangguniang Barangay Member",
  "Sangguniang Barangay Member",
  "Sangguniang Barangay Member",
  "Sangguniang Barangay Member",
  "Sangguniang Barangay Member",
  "SK Chairperson"
];

export default function OfficialsInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;

  const [officials, setOfficials] = useState<OfficialData[]>(
    STANDARD_POSITIONS.map(position => ({
      position,
      isCompleted: false
    }))
  );

  const [selectedOfficialIndex, setSelectedOfficialIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [landlineNumber, setLandlineNumber] = useState("");

  // Load officials from database when component mounts
  useEffect(() => {
    const loadOfficials = async () => {
      if (!locationState?.barangay || !locationState?.region) return;

      try {
        console.log('Loading officials for barangay:', locationState.barangay);
        
        // Map region names to exact table names
        const regionTableMap: Record<string, string> = {
          'REGION 1': 'REGION 1',
          'REGION 2': 'REGION 2',
          'REGION 3': 'REGION 3',
          'REGION 4A': 'REGION 4A',
          'REGION 4B': 'REGION 4B',
          'REGION 5': 'REGION 5',
          'REGION 6': 'REGION 6',
          'REGION 7': 'REGION 7',
          'REGION 8': 'REGION 8',
          'REGION 9': 'REGION 9',
          'REGION 10': 'REGION 10',
          'REGION 11': 'REGION 11',
          'REGION 12': 'REGION 12',
          'REGION 13': 'REGION 13',
          'NCR': 'NCR',
          'CAR': 'CAR',
          'BARMM': 'BARMM'
        };

        const regionTable = regionTableMap[locationState.region];
        if (!regionTable) {
          console.error('Unknown region:', locationState.region);
          return;
        }

        // Use raw SQL query to handle dynamic table names
        const { data, error } = await supabase.rpc('get_officials_by_region', {
          region_name: regionTable,
          barangay_name: locationState.barangay,
          province_name: locationState.province,
          municipality_name: locationState.municipality
        });

        if (error) {
          console.error('Error loading officials:', error);
          // Fallback: try direct table query with proper typing
          await loadOfficialsDirectly(regionTable);
          return;
        }

        if (data && data.length > 0) {
          console.log('Loaded officials data:', data);
          updateOfficialsWithData(data);
        }
      } catch (error) {
        console.error('Error in loadOfficials:', error);
        // Try fallback approach
        await loadOfficialsDirectly(locationState.region);
      }
    };

    const loadOfficialsDirectly = async (regionName: string) => {
      try {
        // Since we can't use dynamic table names with typed client,
        // we'll handle each region case explicitly
        let data: any[] = [];
        
        switch (regionName) {
          case 'REGION 1':
            const { data: region1Data } = await supabase
              .from('REGION 1')
              .select('*')
              .eq('BARANGAY', locationState.barangay)
              .eq('PROVINCE', locationState.province)
              .eq('CITY/MUNICIPALITY', locationState.municipality);
            data = region1Data || [];
            break;
          case 'REGION 2':
            const { data: region2Data } = await supabase
              .from('REGION 2')
              .select('*')
              .eq('BARANGAY', locationState.barangay)
              .eq('PROVINCE', locationState.province)
              .eq('CITY/MUNICIPALITY', locationState.municipality);
            data = region2Data || [];
            break;
          case 'REGION 3':
            const { data: region3Data } = await supabase
              .from('REGION 3')
              .select('*')
              .eq('BARANGAY', locationState.barangay)
              .eq('PROVINCE', locationState.province)
              .eq('CITY/MUNICIPALITY', locationState.municipality);
            data = region3Data || [];
            break;
          case 'NCR':
            const { data: ncrData } = await supabase
              .from('NCR')
              .select('*')
              .eq('BARANGAY', locationState.barangay)
              .eq('PROVINCE', locationState.province)
              .eq('CITY/MUNICIPALITY', locationState.municipality);
            data = ncrData || [];
            break;
          // Add other regions as needed
          default:
            console.log('Region not handled in switch:', regionName);
            return;
        }

        if (data && data.length > 0) {
          updateOfficialsWithData(data);
        }
      } catch (error) {
        console.error('Error in loadOfficialsDirectly:', error);
      }
    };

    const updateOfficialsWithData = (data: any[]) => {
      const updatedOfficials = officials.map(official => {
        const dbOfficial = data.find((d: any) => d.POSITION === official.position);
        if (dbOfficial) {
          return {
            ...official,
            firstName: dbOfficial.FIRSTNAME || '',
            middleName: dbOfficial.MIDDLENAME || '',
            lastName: dbOfficial.LASTNAME || '',
            suffix: dbOfficial.SUFFIX || '',
            isCompleted: !!(dbOfficial.FIRSTNAME && dbOfficial.LASTNAME)
          };
        }
        return official;
      });
      setOfficials(updatedOfficials);
    };

    loadOfficials();
  }, [locationState]);

  const handleOfficialClick = (index: number) => {
    setSelectedOfficialIndex(index);
    setIsModalOpen(true);
  };

  const handleOfficialSave = (officialData: Partial<OfficialData>) => {
    if (selectedOfficialIndex !== null) {
      const updatedOfficials = [...officials];
      updatedOfficials[selectedOfficialIndex] = {
        ...updatedOfficials[selectedOfficialIndex],
        ...officialData,
        isCompleted: true
      };
      setOfficials(updatedOfficials);
    }
    setIsModalOpen(false);
    setSelectedOfficialIndex(null);
  };

  const handleNext = () => {
    navigate("/register/logo", { 
      state: { 
        ...locationState,
        officials: officials,
        phoneNumber,
        landlineNumber
      } 
    });
  };

  const handleBack = () => {
    navigate("/register/location", { 
      state: locationState 
    });
  };

  const getOfficialDisplayName = (official: OfficialData) => {
    if (!official.isCompleted) return official.position;
    const nameParts = [official.firstName, official.middleName, official.lastName, official.suffix].filter(Boolean);
    return nameParts.length > 0 ? nameParts.join(' ') : official.position;
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-red-600 text-white">
          <button onClick={handleBack} className="text-white hover:text-gray-200">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold">Edit Barangay Official</h1>
          <div className="w-6" />
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <RegistrationProgress currentStep="details" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Location Info */}
            <div className="text-left">
              <div className="text-xs text-gray-600 mb-1">Location</div>
              <div className="text-sm font-medium text-gray-900">{locationState?.barangay}</div>
              <div className="text-xs text-gray-500">
                {locationState?.municipality}, {locationState?.province}
              </div>
            </div>

            {/* Officials List */}
            <div className="space-y-3">
              <div className="text-left">
                <div className="text-xs text-gray-600 mb-1">Details</div>
                <div className="text-sm font-medium text-gray-900">Please check the names of your officials</div>
              </div>
              
              {officials.map((official, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg p-4 flex items-center justify-between cursor-pointer transition-colors ${
                    official.isCompleted 
                      ? 'bg-white border border-gray-200' 
                      : 'border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handleOfficialClick(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${official.isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {getOfficialDisplayName(official)}
                      </p>
                      {official.isCompleted && (
                        <p className="text-sm text-gray-600">{official.position}</p>
                      )}
                    </div>
                  </div>
                  <Edit2 className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>

            {/* Phone Number Section */}
            <div className="space-y-4 mt-6">
              <div className="text-left">
                <div className="text-xs text-gray-600 mb-1">Contact</div>
                <div className="text-sm font-medium text-gray-900">Verify/Confirm your official barangay number</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/d61c25bf-51d4-4bc8-a8ff-69e0b901ee3a.png" 
                    alt="Philippines Flag" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-600">+63</span>
                <Input 
                  placeholder="12345" 
                  className="flex-1"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Landline Section */}
            <div className="space-y-4">
              <div className="text-left">
                <div className="text-xs text-gray-600 mb-1">Landline</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-600">02</span>
                <Input 
                  placeholder="047-222-5173" 
                  className="flex-1"
                  value={landlineNumber}
                  onChange={(e) => setLandlineNumber(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="p-4 border-t">
          <Button
            onClick={handleNext}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-12 text-base font-medium"
          >
            NEXT
          </Button>
        </div>

        {/* Official Details Modal */}
        {selectedOfficialIndex !== null && (
          <OfficialDetailsModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedOfficialIndex(null);
            }}
            official={officials[selectedOfficialIndex]}
            onSave={handleOfficialSave}
          />
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="px-8 py-6 border-b">
          <RegistrationProgress currentStep="details" />
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Barangay Official</h1>
            <p className="text-gray-600">Update official information for your barangay</p>
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

            {/* Officials List */}
            <div className="space-y-4">
              <div className="text-left">
                <div className="text-xs text-gray-600 mb-1">Details</div>
                <div className="text-sm font-medium text-gray-900">Please check the names of your officials</div>
              </div>
              
              {officials.map((official, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg p-4 flex items-center justify-between cursor-pointer transition-colors ${
                    official.isCompleted 
                      ? 'bg-white border border-gray-200 hover:bg-gray-50' 
                      : 'border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handleOfficialClick(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${official.isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {getOfficialDisplayName(official)}
                      </p>
                      {official.isCompleted && (
                        <p className="text-sm text-gray-600">{official.position}</p>
                      )}
                    </div>
                  </div>
                  <Edit2 className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>

            {/* Phone and contact sections */}
            <div className="space-y-6">
              <div>
                <div className="text-left mb-3">
                  <div className="text-xs text-gray-600 mb-1">Contact</div>
                  <div className="text-sm font-medium text-gray-900">Verify/Confirm your official barangay number</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/d61c25bf-51d4-4bc8-a8ff-69e0b901ee3a.png" 
                      alt="Philippines Flag" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-600">+63</span>
                  <Input 
                    placeholder="12345" 
                    className="flex-1"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="text-left mb-3">
                  <div className="text-xs text-gray-600 mb-1">Landline</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600">02</span>
                  <Input 
                    placeholder="047-222-5173" 
                    className="flex-1"
                    value={landlineNumber}
                    onChange={(e) => setLandlineNumber(e.target.value)}
                  />
                </div>
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

        {/* Official Details Modal */}
        {selectedOfficialIndex !== null && (
          <OfficialDetailsModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedOfficialIndex(null);
            }}
            official={officials[selectedOfficialIndex]}
            onSave={handleOfficialSave}
          />
        )}
      </div>
    </div>
  );
}
