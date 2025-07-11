
import { useAuth } from "@/contexts/AuthContext";

export const Logo = () => {
  const { user, userRole } = useAuth();
  
  // Get actual location data from user profile
  const getLocationText = () => {
    if (user?.municipality && user?.province) {
      return `${user.municipality}, ${user.province}`;
    }
    return "Location";
  };

  // Get Punong Barangay name from officials data
  const getPunongBarangayName = () => {
    if (user?.officials_data && Array.isArray(user.officials_data)) {
      const punongBarangay = user.officials_data.find(
        (official: any) => official.position === "Punong Barangay"
      );
      if (punongBarangay) {
        const firstName = punongBarangay.firstName || punongBarangay.FIRSTNAME;
        const lastName = punongBarangay.lastName || punongBarangay.LASTNAME;
        if (firstName && lastName) {
          return `${firstName} ${lastName}`;
        }
      }
    }
    return "Punong Barangay";
  };

  // Show logo if available, otherwise show initials
  const getLogoDisplay = () => {
    if (user?.logo_url) {
      return (
        <img 
          src={user.logo_url} 
          alt="Barangay Logo" 
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
        BO
      </div>
    );
  };

  if (userRole === "official") {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
        {getLogoDisplay()}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate font-outfit">
            {getPunongBarangayName()}
          </h3>
          <p className="text-xs text-gray-600 truncate">{getLocationText()}</p>
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
