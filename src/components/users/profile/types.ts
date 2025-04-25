
import { Json } from "@/integrations/supabase/types";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  settings?: {
    is_banned: boolean | null;
    can_sell: boolean | null;
    is_verified: boolean | null;
    phone_number: string | null;
    address: Json | null;
    created_at: string;
    updated_at: string;
    user_id: string;
  };
  activities?: UserActivity[];
}

export interface UserActivity {
  id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
}
