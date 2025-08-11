
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Phone, User } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RegistrationProgress } from "@/components/ui/registration-progress";

import { Skeleton } from "@/components/ui/skeleton";
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

  const [isLoading, setIsLoading] = useState(true);

  // Load officials from database when component mounts
  useEffect(() => {
    const loadOfficials = async () => {
      if (!locationState?.barangay || !locationState?.region) {
        console.log('Missing location data, skipping officials load. LocationState:', locationState);
        setIsLoading(false);
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
          setIsLoading(false);
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
      } finally {
        setIsLoading(false);
      }
    };

    loadOfficials();
  }, [locationState]);


  const handleNext = () => {
    navigate("/register/official-documents", { 
      state: { 
        ...locationState,
        officials: officials
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

  const renderOfficialSection = (title: string, officialsList: OfficialData[], startIndex: number) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
          {Array.from({ length: officialsList.length }).map((_, index) => (
            <div key={index} className="rounded-lg p-4 border">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
        {officialsList.map((official, index) => {
          const actualIndex = officials.findIndex(o => o.position === official.position);
          const displayName = getOfficialDisplayName(official);
          const hasData = displayName !== null;
          
          return (
            <div 
              key={official.position} 
              className={`rounded-lg p-4 flex items-center justify-between transition-all duration-200 ${
                hasData
                  ? 'bg-white border border-red-200 shadow-sm' 
                  : 'border-2 border-dashed border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  hasData ? 'bg-red-100' : 'bg-gray-300'
                }`}>
                  <User className={`h-5 w-5 ${hasData ? 'text-red-600' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${
                    hasData ? 'text-gray-900' : 'text-gray-500'
                  } ${isMobile ? 'text-sm' : ''}`}>
                    {isMobile ? truncateName(official.position, 20) : official.position}
                  </p>
                  {hasData ? (
                    <p className={`text-red-700 font-medium mt-1 truncate ${
                      isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      {isMobile ? truncateName(displayName, 30) : displayName}
                    </p>
                  ) : (
                    <p className={`text-gray-400 mt-1 ${
                      isMobile ? 'text-xs' : 'text-xs'
                    }`}>
                      No details available
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasData && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (isMobile) {
    const { executive, sangguniang, youth } = getOfficialsByCategory();

    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="h-1 w-3/5 bg-red-600"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={handleBack} className="text-red-600 hover:text-red-700">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-red-600">Barangay Official Information</h1>
          <div className="w-6" />
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
          </div>
        </div>

        {/* Next Button */}
        <div className="p-4 border-t">
          <Button
            onClick={handleNext}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-12 text-base font-medium"
            disabled={isLoading}
          >
            NEXT
          </Button>
        </div>

      </div>
    );
  }

  // Desktop version
  const { executive, sangguniang, youth } = getOfficialsByCategory();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="h-1 w-3/5 bg-red-600"></div>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-red-600 mb-6 hover:text-red-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Barangay Official Information</h1>
            <p className="text-gray-600">Official information for your barangay</p>
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
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-base font-medium mt-8"
            disabled={isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
