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
      barangay_membership_requests: {
        Row: {
          admin_notes: string | null
          barangay_name: string
          id: string
          request_message: string | null
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          barangay_name: string
          id?: string
          request_message?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          barangay_name?: string
          id?: string
          request_message?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
      cart_items: {
        Row: {
          added_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          product_id: string
          quantity: number
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          availability: string | null
          category: string
          company: string
          created_at: string | null
          description: string
          education: string | null
          experience: string
          id: string
          is_open: boolean | null
          license: string | null
          location: string
          logo_url: string | null
          qualifications: string[] | null
          responsibilities: string[]
          salary: string | null
          skills: string[] | null
          title: string
          updated_at: string | null
          work_approach: string | null
        }
        Insert: {
          availability?: string | null
          category: string
          company: string
          created_at?: string | null
          description: string
          education?: string | null
          experience: string
          id?: string
          is_open?: boolean | null
          license?: string | null
          location: string
          logo_url?: string | null
          qualifications?: string[] | null
          responsibilities: string[]
          salary?: string | null
          skills?: string[] | null
          title: string
          updated_at?: string | null
          work_approach?: string | null
        }
        Update: {
          availability?: string | null
          category?: string
          company?: string
          created_at?: string | null
          description?: string
          education?: string | null
          experience?: string
          id?: string
          is_open?: boolean | null
          license?: string | null
          location?: string
          logo_url?: string | null
          qualifications?: string[] | null
          responsibilities?: string[]
          salary?: string | null
          skills?: string[] | null
          title?: string
          updated_at?: string | null
          work_approach?: string | null
        }
        Relationships: []
      }
      media_files: {
        Row: {
          alt_text: string | null
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
          alt_text?: string | null
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
          alt_text?: string | null
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
      notifications: {
        Row: {
          category: string
          created_at: string
          id: string
          message: string
          metadata: Json | null
          priority: string
          read_at: string | null
          recipient_id: string
          sender_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          priority?: string
          read_at?: string | null
          recipient_id: string
          sender_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_category_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_category_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_category_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_collections: {
        Row: {
          collection_id: string
          created_at: string
          id: string
          product_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          id?: string
          product_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          average_rating: number | null
          brand: string | null
          category_id: string | null
          created_at: string
          description: string | null
          dimensions_cm: Json | null
          gallery_image_urls: string[] | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          main_image_url: string | null
          name: string
          original_price: number | null
          price: number
          rating_count: number | null
          return_policy: string | null
          seo_description: string | null
          seo_title: string | null
          shipping_info: string | null
          sku: string | null
          sold_count: number | null
          specifications: Json | null
          stock_quantity: number
          tags: string[] | null
          updated_at: string
          vendor_id: string
          weight_kg: number | null
        }
        Insert: {
          average_rating?: number | null
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          dimensions_cm?: Json | null
          gallery_image_urls?: string[] | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          main_image_url?: string | null
          name: string
          original_price?: number | null
          price: number
          rating_count?: number | null
          return_policy?: string | null
          seo_description?: string | null
          seo_title?: string | null
          shipping_info?: string | null
          sku?: string | null
          sold_count?: number | null
          specifications?: Json | null
          stock_quantity?: number
          tags?: string[] | null
          updated_at?: string
          vendor_id: string
          weight_kg?: number | null
        }
        Update: {
          average_rating?: number | null
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          dimensions_cm?: Json | null
          gallery_image_urls?: string[] | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          main_image_url?: string | null
          name?: string
          original_price?: number | null
          price?: number
          rating_count?: number | null
          return_policy?: string | null
          seo_description?: string | null
          seo_title?: string | null
          shipping_info?: string | null
          sku?: string | null
          sold_count?: number | null
          specifications?: Json | null
          stock_quantity?: number
          tags?: string[] | null
          updated_at?: string
          vendor_id?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          barangay: string | null
          "Barangay Reference": string | null
          created_at: string | null
          first_name: string | null
          id: string
          invited_by: string | null
          last_login: string | null
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          barangay?: string | null
          "Barangay Reference"?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          invited_by?: string | null
          last_login?: string | null
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          barangay?: string | null
          "Barangay Reference"?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          invited_by?: string | null
          last_login?: string | null
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rbi_draft_forms: {
        Row: {
          created_at: string | null
          form_data: Json
          id: string
          last_completed_step: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          form_data: Json
          id?: string
          last_completed_step?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          form_data?: Json
          id?: string
          last_completed_step?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string
          description: string
          id: string
          priority: string | null
          resolved_at: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
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
      user_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          first_name: string | null
          id: string
          invited_by: string | null
          last_name: string | null
          role: string
          status: string
          updated_at: string
          welcome_message: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          first_name?: string | null
          id?: string
          invited_by?: string | null
          last_name?: string | null
          role: string
          status?: string
          updated_at?: string
          welcome_message?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          first_name?: string | null
          id?: string
          invited_by?: string | null
          last_name?: string | null
          role?: string
          status?: string
          updated_at?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
      user_role_settings: {
        Row: {
          created_at: string
          id: string
          permissions: Json
          role: string
          updated_at: string
          user_count: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          permissions?: Json
          role: string
          updated_at?: string
          user_count?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          permissions?: Json
          role?: string
          updated_at?: string
          user_count?: number | null
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
      user_system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          created_at: string
          id: string
          is_verified: boolean | null
          logo_url: string | null
          shop_description: string | null
          shop_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          shop_description?: string | null
          shop_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          shop_description?: string | null
          shop_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      update_role_user_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_last_login: {
        Args: { user_id: string }
        Returns: undefined
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
