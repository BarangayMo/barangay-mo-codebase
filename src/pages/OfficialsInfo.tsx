
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

const EXECUTIVE_POSITIONS = [
  "Punong Barangay",
  "Barangay Secretary", 
  "Barangay Treasurer"
];

const SANGGUNIANG_POSITIONS = [
  "Sangguniang Barangay Member 1",
  "Sangguniang Barangay Member 2",
  "Sangguniang Barangay Member 3",
  "Sangguniang Barangay Member 4",
  "Sangguniang Barangay Member 5",
  "Sangguniang Barangay Member 6",
  "Sangguniang Barangay Member 7"
];

const YOUTH_POSITIONS = [
  "SK Chairperson"
];

export default function OfficialsInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const locationState = location.state as LocationState;

  const [officials, setOfficials] = useState<OfficialData[]>([
    ...EXECUTIVE_POSITIONS.map(position => ({ position, isCompleted: false })),
    ...SANGGUNIANG_POSITIONS.map(position => ({ position, isCompleted: false })),
    ...YOUTH_POSITIONS.map(position => ({ position, isCompleted: false }))
  ]);

  const [selectedOfficialIndex, setSelectedOfficialIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("9171234567");
  const [landlineNumber, setLandlineNumber] = useState("047-222-5173");

  // Load officials from database when component mounts
  useEffect(() => {
    const loadOfficials = async () => {
      if (!locationState?.barangay || !locationState?.region) {
        console.log('Missing location data, skipping officials load. LocationState:', locationState);
        return;
      }

      try {
        console.log('Loading officials for:', {
          region: locationState.region,
          barangay: locationState.barangay,
          municipality: locationState.municipality,
          province: locationState.province
        });

        // Query the region table directly with properly quoted column names
        const regionTableName = locationState.region;
        console.log('Querying table:', regionTableName);

        const { data, error } = await supabase
          .from(regionTableName as any)
          .select('"POSITION", "FIRSTNAME", "MIDDLENAME", "LASTNAME", "SUFFIX"')
          .eq('"BARANGAY"', locationState.barangay)
          .eq('"PROVINCE"', locationState.province)
          .eq('"CITY/MUNICIPALITY"', locationState.municipality);

        if (error) {
          console.error('Error loading officials:', error);
          return;
        }

        console.log('Raw officials data from DB:', data);

        if (data && data.length > 0) {
          console.log('Processing officials data...');
          
          // Update officials with database data
          setOfficials(prevOfficials => {
            const updatedOfficials = prevOfficials.map(official => {
              let matchingDbOfficial;
              
              // Direct position mapping for exact matches
              const positionMappings = {
                'Punong Barangay': 'Punong Barangay',
                'Barangay Secretary': 'Barangay Secretary',
                'Barangay Treasurer': 'Barangay Treasurer',
                'SK Chairperson': 'SK Chairperson'
              };

              // Check for direct match first
              matchingDbOfficial = data.find((d: any) => 
                d.POSITION === positionMappings[official.position as keyof typeof positionMappings] ||
                d.POSITION === official.position
              );

              // For Sangguniang Barangay Members, find any available member
              if (!matchingDbOfficial && official.position.startsWith('Sangguniang Barangay Member')) {
                const sangguniangMembers = data.filter((d: any) => 
                  d.POSITION === 'Sangguniang Barangay Member'
                );
                
                console.log('Found Sangguniang members:', sangguniangMembers.length);
                
                // Get the member number from the position (e.g., "Member 1" -> 1)
                const memberNumber = parseInt(official.position.split(' ').pop() || '1');
                
                // Try to assign members in order
                if (sangguniangMembers[memberNumber - 1]) {
                  matchingDbOfficial = sangguniangMembers[memberNumber - 1];
                  console.log(`Assigned ${official.position} to:`, matchingDbOfficial);
                }
              }

              if (matchingDbOfficial) {
                const hasNames = matchingDbOfficial.FIRSTNAME || matchingDbOfficial.LASTNAME;
                console.log(`Found data for ${official.position}:`, matchingDbOfficial);
                
                return {
                  ...official,
                  firstName: matchingDbOfficial.FIRSTNAME || '',
                  middleName: matchingDbOfficial.MIDDLENAME || '',
                  lastName: matchingDbOfficial.LASTNAME || '',
                  suffix: matchingDbOfficial.SUFFIX || '',
                  isCompleted: hasNames
                };
              }
              
              console.log(`No data found for ${official.position}`);
              return official;
            });
            
            console.log('Updated officials:', updatedOfficials);
            return updatedOfficials;
          });
        } else {
          console.log('No officials data found in database');
        }
      } catch (error) {
        console.error('Error in loadOfficials:', error);
      }
    };

    loadOfficials();
  }, [locationState]);

  const handleOfficialClick = (index: number) => {
    console.log('Official clicked:', index, officials[index]);
    setSelectedOfficialIndex(index);
    setIsModalOpen(true);
  };

  const handleOfficialSave = async (officialData: Partial<OfficialData>) => {
    console.log('Saving official data:', officialData, 'at index:', selectedOfficialIndex);
    
    if (selectedOfficialIndex !== null) {
      // Update local state
      const updatedOfficials = [...officials];
      updatedOfficials[selectedOfficialIndex] = {
        ...updatedOfficials[selectedOfficialIndex],
        ...officialData,
        isCompleted: true
      };
      setOfficials(updatedOfficials);
      console.log('Updated officials:', updatedOfficials);

      // TODO: Save to Supabase database
      // This would require creating/updating records in the region table
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
    if (!official.firstName && !official.lastName) {
      return null;
    }
    const nameParts = [
      official.firstName,
      official.middleName,
      official.lastName,
      official.suffix
    ].filter(part => part && part.trim());
    
    return nameParts.length > 0 ? nameParts.join(' ') : null;
  };

  // Helper function to truncate long names for mobile
  const truncateName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  const getOfficialsByCategory = () => {
    const executive = officials.filter(o => EXECUTIVE_POSITIONS.includes(o.position));
    const sangguniang = officials.filter(o => o.position.startsWith('Sangguniang Barangay Member'));
    const youth = officials.filter(o => YOUTH_POSITIONS.includes(o.position));
    
    return { executive, sangguniang, youth };
  };

  const renderOfficialSection = (title: string, officialsList: OfficialData[], startIndex: number) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
      {officialsList.map((official, index) => {
        const actualIndex = officials.findIndex(o => o.position === official.position);
        const displayName = getOfficialDisplayName(official);
        const hasData = displayName !== null;
        
        return (
          <div 
            key={official.position} 
            className={`rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all duration-200 ${
              hasData
                ? 'bg-white border border-green-200 shadow-sm hover:shadow-md hover:border-green-300' 
                : 'border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
            }`}
            onClick={() => handleOfficialClick(actualIndex)}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                hasData ? 'bg-green-100' : 'bg-gray-300'
              }`}>
                <User className={`h-5 w-5 ${hasData ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${
                  hasData ? 'text-gray-900' : 'text-gray-500'
                } ${isMobile ? 'text-sm' : ''}`}>
                  {isMobile ? truncateName(official.position, 20) : official.position}
                </p>
                {hasData ? (
                  <p className={`text-green-700 font-medium mt-1 truncate ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    {isMobile ? truncateName(displayName, 30) : displayName}
                  </p>
                ) : (
                  <p className={`text-gray-400 mt-1 ${
                    isMobile ? 'text-xs' : 'text-xs'
                  }`}>
                    Tap to add official details
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasData && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
              <Edit2 className={`h-4 w-4 ${hasData ? 'text-gray-400' : 'text-gray-300'}`} />
            </div>
          </div>
        );
      })}
    </div>
  );

  if (isMobile) {
    const { executive, sangguniang, youth } = getOfficialsByCategory();

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
          <div className="p-4 space-y-6">
            {/* Location Info */}
            <div className="text-left">
              <div className="text-xs text-gray-600 mb-1">Location</div>
              <div className="text-sm font-medium text-gray-900">{locationState?.barangay}</div>
              <div className="text-xs text-gray-500">
                {locationState?.municipality}, {locationState?.province}
              </div>
            </div>

            {/* Officials List by Category */}
            <div className="space-y-6">
              <div className="text-left">
                <div className="text-xs text-gray-600 mb-1">Details</div>
                <div className="text-sm font-medium text-gray-900">Please check the names of your officials</div>
              </div>
              
              {renderOfficialSection("Executive Officials", executive, 0)}
              {renderOfficialSection("Sangguniang Barangay", sangguniang, executive.length)}
              {renderOfficialSection("Youth Council", youth, executive.length + sangguniang.length)}
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
                  placeholder="9171234567" 
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
              console.log('Closing modal');
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
  const { executive, sangguniang, youth } = getOfficialsByCategory();

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

            {/* Officials List by Category */}
            <div className="space-y-6">
              <div className="text-left">
                <div className="text-xs text-gray-600 mb-1">Details</div>
                <div className="text-sm font-medium text-gray-900">Please check the names of your officials</div>
              </div>
              
              {renderOfficialSection("Executive Officials", executive, 0)}
              {renderOfficialSection("Sangguniang Barangay", sangguniang, executive.length)}
              {renderOfficialSection("Youth Council", youth, executive.length + sangguniang.length)}
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
                    placeholder="9171234567" 
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
              console.log('Closing modal');
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
