export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Barangays: {
        Row: {
          "Activate Brgy?": string | null
          "Ambulance Phone": string | null
          BARANGAY: string | null
          "Barangay Code": number | null
          "BLDG No": string | null
          "BPAT Executive": string | null
          "BPAT Phone": string | null
          "BRGY OFFICIALs": string | null
          "CITY/MUNICIPALITY": string | null
          Coordinates: string | null
          Created: string | null
          Division: string | null
          "Email Address": string | null
          "Email Address_1": string | null
          Facebook: string | null
          "Fire Department Phone": string | null
          FIRSTNAME: string | null
          "Foundation Date": string | null
          ID: string
          "Land Area": string | null
          LASTNAME: string | null
          "Letter Head": string | null
          "Local Police Contact": string | null
          "Location Pin": string | null
          Logo: string | null
          MIDDLENAME: string | null
          "Mobile Number": string | null
          "My Brgy Doesnt have FB": string | null
          "My Brgy Doesnt have website": string | null
          "My Brgy have FB": string | null
          "My Brgy have website": string | null
          "No of Divisions": string | null
          "PB/SK ID": string | null
          "PB/SK Mobile No": string | null
          Population: string | null
          PROVINCE: string | null
          REGION: string | null
          Street: string | null
          SUFFIX: string | null
          "Telephone No": string | null
          Updated: string | null
          "VAWC Hotline No": string | null
          Website: string | null
          "ZIP Code": string | null
        }
        Insert: {
          "Activate Brgy?"?: string | null
          "Ambulance Phone"?: string | null
          BARANGAY?: string | null
          "Barangay Code"?: number | null
          "BLDG No"?: string | null
          "BPAT Executive"?: string | null
          "BPAT Phone"?: string | null
          "BRGY OFFICIALs"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          Coordinates?: string | null
          Created?: string | null
          Division?: string | null
          "Email Address"?: string | null
          "Email Address_1"?: string | null
          Facebook?: string | null
          "Fire Department Phone"?: string | null
          FIRSTNAME?: string | null
          "Foundation Date"?: string | null
          ID?: string
          "Land Area"?: string | null
          LASTNAME?: string | null
          "Letter Head"?: string | null
          "Local Police Contact"?: string | null
          "Location Pin"?: string | null
          Logo?: string | null
          MIDDLENAME?: string | null
          "Mobile Number"?: string | null
          "My Brgy Doesnt have FB"?: string | null
          "My Brgy Doesnt have website"?: string | null
          "My Brgy have FB"?: string | null
          "My Brgy have website"?: string | null
          "No of Divisions"?: string | null
          "PB/SK ID"?: string | null
          "PB/SK Mobile No"?: string | null
          Population?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          Street?: string | null
          SUFFIX?: string | null
          "Telephone No"?: string | null
          Updated?: string | null
          "VAWC Hotline No"?: string | null
          Website?: string | null
          "ZIP Code"?: string | null
        }
        Update: {
          "Activate Brgy?"?: string | null
          "Ambulance Phone"?: string | null
          BARANGAY?: string | null
          "Barangay Code"?: number | null
          "BLDG No"?: string | null
          "BPAT Executive"?: string | null
          "BPAT Phone"?: string | null
          "BRGY OFFICIALs"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          Coordinates?: string | null
          Created?: string | null
          Division?: string | null
          "Email Address"?: string | null
          "Email Address_1"?: string | null
          Facebook?: string | null
          "Fire Department Phone"?: string | null
          FIRSTNAME?: string | null
          "Foundation Date"?: string | null
          ID?: string
          "Land Area"?: string | null
          LASTNAME?: string | null
          "Letter Head"?: string | null
          "Local Police Contact"?: string | null
          "Location Pin"?: string | null
          Logo?: string | null
          MIDDLENAME?: string | null
          "Mobile Number"?: string | null
          "My Brgy Doesnt have FB"?: string | null
          "My Brgy Doesnt have website"?: string | null
          "My Brgy have FB"?: string | null
          "My Brgy have website"?: string | null
          "No of Divisions"?: string | null
          "PB/SK ID"?: string | null
          "PB/SK Mobile No"?: string | null
          Population?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          Street?: string | null
          SUFFIX?: string | null
          "Telephone No"?: string | null
          Updated?: string | null
          "VAWC Hotline No"?: string | null
          Website?: string | null
          "ZIP Code"?: string | null
        }
        Relationships: []
      }
      media_files: {
        Row: {
          category: string
          content_type: string
          deleted_at: string | null
          file_size: number
          file_url: string
          filename: string
          id: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          category: string
          content_type: string
          deleted_at?: string | null
          file_size: number
          file_url: string
          filename: string
          id?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content_type?: string
          deleted_at?: string | null
          file_size?: number
          file_url?: string
          filename?: string
          id?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          barangay: string | null
          "Barangay Reference": string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          barangay?: string | null
          "Barangay Reference"?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          barangay?: string | null
          "Barangay Reference"?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_api_keys: {
        Row: {
          created_at: string | null
          id: string
          key_name: string
          key_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key_name: string
          key_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key_name?: string
          key_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_data: Json
          activity_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_data: Json
          activity_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_data?: Json
          activity_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          address: Json | null
          avatar_url: string | null
          can_sell: boolean | null
          created_at: string
          is_banned: boolean | null
          is_verified: boolean | null
          phone_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          can_sell?: boolean | null
          created_at?: string
          is_banned?: boolean | null
          is_verified?: boolean | null
          phone_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          can_sell?: boolean | null
          created_at?: string
          is_banned?: boolean | null
          is_verified?: boolean | null
          phone_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role: "resident" | "official" | "superadmin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["resident", "official", "superadmin"],
    },
  },
} as const
