
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";

export const Logo = () => {
  const { userRole } = useAuth();
  const { profile } = useUserProfile();
  
  console.log('Logo component - profile data:', profile);
  console.log('Logo component - userRole:', userRole);
  console.log('Logo component - officials_data:', profile?.officials_data);
  
  // Get actual location data from user profile
  const getLocationText = () => {
    const municipality = profile?.municipality;
    const province = profile?.province;
    const barangay = profile?.barangay;
    
    console.log('Location data:', { municipality, province, barangay });
    
    if (municipality && province) {
      return `${municipality}, ${province}`;
    }
    if (barangay) {
      return barangay;
    }
    return "Location not set";
  };

  // Get Punong Barangay name from officials data
  const getPunongBarangayName = () => {
    console.log('Getting Punong Barangay name from:', profile?.officials_data);
    
    if (profile?.officials_data && Array.isArray(profile.officials_data)) {
      const punongBarangay = profile.officials_data.find(
        (official: any) => official.position === "Punong Barangay" || 
                          official.POSITION === "Punong Barangay"
      );
      
      console.log('Found Punong Barangay:', punongBarangay);
      
      if (punongBarangay) {
        const firstName = punongBarangay.firstName || punongBarangay.FIRSTNAME || punongBarangay.first_name;
        const lastName = punongBarangay.lastName || punongBarangay.LASTNAME || punongBarangay.last_name;
        const middleName = punongBarangay.middleName || punongBarangay.MIDDLENAME || punongBarangay.middle_name;
        
        if (firstName && lastName) {
          const fullName = middleName 
            ? `${firstName} ${middleName} ${lastName}`
            : `${firstName} ${lastName}`;
          return fullName;
        }
      }
    }
    return "Punong Barangay";
  };

  // Show logo if available, otherwise show initials
  const getLogoDisplay = () => {
    if (profile?.logo_url) {
      return (
        <img 
          src={profile.logo_url} 
          alt="Barangay Logo" 
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-sm font-medium text-red-600">
        BO
      </div>
    );
  };

  if (userRole === "official") {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100 shadow-sm">
        {getLogoDisplay()}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate font-outfit">
            {getPunongBarangayName()}
          </h3>
          <p className="text-xs text-red-600 truncate font-medium">{getLocationText()}</p>
          <p className="text-xs text-gray-500 truncate">BarangayMo Officials</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        <span className="text-white text-sm font-bold">BM</span>
      </div>
      <span className="text-lg font-bold text-gray-900 font-outfit">BarangayMo</span>
    </div>
  );
};
