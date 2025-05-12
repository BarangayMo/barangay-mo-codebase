
import { Json } from "@/integrations/supabase/types";

export interface RbiFormData {
  personalDetails: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    suffix?: string;
    [key: string]: any;
  };
  address: {
    street?: string;
    barangay?: string;
    houseNumber?: string;
    zone?: string;
    division?: string;
    residenceSince?: string;
    [key: string]: any;
  };
  otherDetails: {
    dateOfBirth?: string;
    sex?: string;
    placeOfBirth?: string;
    bloodType?: string;
    religion?: string;
    civilStatus?: string;
    contactNumber?: string;
    email?: string;
    nationality?: string;
    eyeColor?: string;
    [key: string]: any;
  };
  parentDetails: {
    fatherFirstName?: string;
    fatherLastName?: string;
    fatherMiddleName?: string;
    fatherSuffix?: string;
    motherFirstName?: string;
    motherLastName?: string;
    motherMiddleName?: string;
    parentStatus?: string;
    fatherAlive?: string;
    motherAlive?: string;
    hasVehicle?: string;
    hasGarage?: string;
    [key: string]: any;
  };
  education: {
    attainment?: string;
    profession?: string;
    skills?: string;
    jobStatus?: string;
    [key: string]: any;
  };
  health: {
    height?: string;
    weight?: string;
    hasCondition?: string;
    condition?: string;
    hasAssistance?: string;
    [key: string]: any;
  };
  housing: {
    isHeadOfFamily?: string;
    headName?: string;
    isRenting?: string;
    ownershipType?: string;
    ownerName?: string;
    companyName?: string;
    [key: string]: any;
  };
  beneficiary: {
    programs?: string[];
    [key: string]: any;
  };
}

export interface RbiFormComponentProps {
  formData: RbiFormData;
  setFormData: React.Dispatch<React.SetStateAction<RbiFormData>>;
  errors: Record<string, any>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}
