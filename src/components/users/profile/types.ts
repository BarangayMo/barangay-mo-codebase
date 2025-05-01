
import { Json } from "@/integrations/supabase/types";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  barangay?: string | null; // Adding barangay property to match the error
  settings?: {
    is_banned: boolean | null;
    can_sell: boolean | null;
    is_verified: boolean | null;
    phone_number: string | null;
    address: Json | null;
    created_at: string;
    updated_at: string;
    user_id: string;
    username?: string; // Adding username property to match the error
    bio?: string; // Adding bio property to match the error
    rbi_number?: string; // Adding rbi_number property to match the error
    avatar_url?: string | null; // Adding avatar_url property to fix the error
  };
  activities?: UserActivity[];
}

export interface UserActivity {
  id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
}
