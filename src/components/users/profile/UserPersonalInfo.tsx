
import { MapPin, Phone, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Json } from "@/integrations/supabase/types";

interface UserPersonalInfoProps {
  first_name: string;
  last_name: string;
  email: string;
  settings?: {
    phone_number: string | null;
    address: Json | null;
    created_at: string;
  };
}

const formatAddress = (address: Json | null): string => {
  if (!address) return '';
  
  if (typeof address === 'object' && address !== null && !Array.isArray(address)) {
    const addressObj = address as Record<string, unknown>;
    const street = addressObj.street;
    const city = addressObj.city;
    
    if (street && city) {
      return `${street}, ${city}`;
    } else if (street) {
      return `${street}`;
    } else if (city) {
      return `${city}`;
    }
  }
  
  return String(address);
};

export const UserPersonalInfo = ({ first_name, last_name, email, settings }: UserPersonalInfoProps) => {
  return (
    <Card className="p-4 sm:p-6 col-span-1">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${first_name} ${last_name}`} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {first_name?.[0]}{last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-base sm:text-lg truncate">{first_name} {last_name}</h3>
            <p className="text-xs sm:text-sm text-gray-500">Member since {new Date(settings?.created_at || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">{email}</span>
          </div>
          {settings?.phone_number && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="truncate">{settings.phone_number}</span>
            </div>
          )}
          {settings?.address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="break-words leading-relaxed">{formatAddress(settings.address)}</span>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-4 sm:my-6" />
      
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Communication</h2>
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full text-sm" 
          onClick={() => window.location.href = `/admin/messages/${first_name}-${last_name}`}
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Message
        </Button>
        
        {settings?.phone_number && (
          <Button 
            variant="outline" 
            className="w-full text-sm" 
            onClick={() => window.location.href = `tel:${settings.phone_number}`}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call User
          </Button>
        )}

        {settings?.address && (
          <div className="mt-4">
            <h3 className="font-medium text-sm mb-2">User Location</h3>
            <div className="bg-gray-100 rounded-lg h-32 sm:h-40 flex items-center justify-center">
              <MapPin className="w-6 sm:w-8 h-6 sm:h-8 text-gray-500" />
              <span className="ml-2 text-gray-500 text-sm">Map View</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
