export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      BARMM: {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION: string
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      budget_allocations: {
        Row: {
          allocated_amount: number
          category: string
          created_at: string
          created_by: string
          id: string
          quarter: number | null
          spent_amount: number | null
          updated_at: string
          year: number
        }
        Insert: {
          allocated_amount: number
          category: string
          created_at?: string
          created_by: string
          id?: string
          quarter?: number | null
          spent_amount?: number | null
          updated_at?: string
          year?: number
        }
        Update: {
          allocated_amount?: number
          category?: string
          created_at?: string
          created_by?: string
          id?: string
          quarter?: number | null
          spent_amount?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          budget: number | null
          campaign_type: string
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          platform: string | null
          start_date: string | null
          status: string
          target_audience: string | null
          title: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          campaign_type?: string
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          id?: string
          platform?: string | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          campaign_type?: string
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          id?: string
          platform?: string | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      CAR: {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
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
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_events: {
        Row: {
          attendees_count: number | null
          created_at: string
          created_by: string
          description: string | null
          event_date: string
          id: string
          location: string
          max_capacity: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          attendees_count?: number | null
          created_at?: string
          created_by: string
          description?: string | null
          event_date: string
          id?: string
          location: string
          max_capacity?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          attendees_count?: number | null
          created_at?: string
          created_by?: string
          description?: string | null
          event_date?: string
          id?: string
          location?: string
          max_capacity?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          barangay_id: string
          comments_count: number | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          image_urls: string[] | null
          likes_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          barangay_id: string
          comments_count?: number | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_urls?: string[] | null
          likes_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          barangay_id?: string
          comments_count?: number | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_urls?: string[] | null
          likes_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints_requests: {
        Row: {
          admin_notes: string | null
          assigned_to: string | null
          barangay_id: string
          created_at: string
          description: string | null
          id: string
          priority: string | null
          resolved_at: string | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          assigned_to?: string | null
          barangay_id: string
          created_at?: string
          description?: string | null
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          assigned_to?: string | null
          barangay_id?: string
          created_at?: string
          description?: string | null
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          is_archived: boolean | null
          last_message_at: string | null
          last_message_id: string | null
          participant_one_id: string
          participant_two_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          last_message_id?: string | null
          participant_one_id: string
          participant_two_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          last_message_id?: string | null
          participant_one_id?: string
          participant_two_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_conversations_last_message"
            columns: ["last_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      council_members: {
        Row: {
          barangay: string
          created_at: string
          created_by: string | null
          email: string | null
          first_name: string
          id: string
          is_active: boolean | null
          landline_number: string | null
          last_name: string
          middle_name: string | null
          municipality: string
          phone_number: string | null
          position: string
          province: string
          region: string
          suffix: string | null
          updated_at: string
        }
        Insert: {
          barangay: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name: string
          id?: string
          is_active?: boolean | null
          landline_number?: string | null
          last_name: string
          middle_name?: string | null
          municipality: string
          phone_number?: string | null
          position: string
          province: string
          region: string
          suffix?: string | null
          updated_at?: string
        }
        Update: {
          barangay?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          landline_number?: string | null
          last_name?: string
          middle_name?: string | null
          municipality?: string
          phone_number?: string | null
          position?: string
          province?: string
          region?: string
          suffix?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          age: number | null
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          application_date: string | null
          cover_letter: string | null
          created_at: string | null
          expected_salary: string | null
          experience_years: number | null
          gender: string | null
          id: string
          job_id: string | null
          notes: string | null
          rating: number | null
          resume_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          application_date?: string | null
          cover_letter?: string | null
          created_at?: string | null
          expected_salary?: string | null
          experience_years?: number | null
          gender?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          rating?: number | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          application_date?: string | null
          cover_letter?: string | null
          created_at?: string | null
          expected_salary?: string | null
          experience_years?: number | null
          gender?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          rating?: number | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          assigned_to: string | null
          availability: string | null
          category: string
          company: string
          created_at: string | null
          created_by: string | null
          description: string
          education: string | null
          experience: string
          id: string
          is_open: boolean | null
          job_code: string | null
          license: string | null
          location: string
          logo_url: string | null
          qualifications: string[] | null
          responsibilities: string[]
          salary: string | null
          seo_description: string | null
          seo_title: string | null
          skills: string[] | null
          slug: string | null
          title: string
          updated_at: string | null
          work_approach: string | null
        }
        Insert: {
          assigned_to?: string | null
          availability?: string | null
          category: string
          company: string
          created_at?: string | null
          created_by?: string | null
          description: string
          education?: string | null
          experience: string
          id?: string
          is_open?: boolean | null
          job_code?: string | null
          license?: string | null
          location: string
          logo_url?: string | null
          qualifications?: string[] | null
          responsibilities: string[]
          salary?: string | null
          seo_description?: string | null
          seo_title?: string | null
          skills?: string[] | null
          slug?: string | null
          title: string
          updated_at?: string | null
          work_approach?: string | null
        }
        Update: {
          assigned_to?: string | null
          availability?: string | null
          category?: string
          company?: string
          created_at?: string | null
          created_by?: string | null
          description?: string
          education?: string | null
          experience?: string
          id?: string
          is_open?: boolean | null
          job_code?: string | null
          license?: string | null
          location?: string
          logo_url?: string | null
          qualifications?: string[] | null
          responsibilities?: string[]
          salary?: string | null
          seo_description?: string | null
          seo_title?: string | null
          skills?: string[] | null
          slug?: string | null
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
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          message_type: string
          metadata: Json | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_type?: string
          metadata?: Json | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_type?: string
          metadata?: Json | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      NCR: {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          category: string
          created_at: string
          id: string
          link_url: string | null
          message: string
          metadata: Json | null
          priority: string
          read: boolean
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
          link_url?: string | null
          message: string
          metadata?: Json | null
          priority?: string
          read?: boolean
          read_at?: string | null
          recipient_id: string
          sender_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          link_url?: string | null
          message?: string
          metadata?: Json | null
          priority?: string
          read?: boolean
          read_at?: string | null
          recipient_id?: string
          sender_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_notifications_recipient"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      official_documents: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          document_type: string
          file_url: string | null
          id: string
          is_public: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          document_type: string
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          document_type?: string
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      officials: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          barangay: string
          created_at: string
          email: string
          first_name: string
          id: string
          is_approved: boolean
          landline_number: string | null
          last_name: string
          middle_name: string | null
          municipality: string
          original_password: string | null
          password_hash: string | null
          phone_number: string
          position: string
          province: string
          region: string
          rejection_reason: string | null
          status: string
          submitted_at: string
          suffix: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          barangay: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_approved?: boolean
          landline_number?: string | null
          last_name: string
          middle_name?: string | null
          municipality: string
          original_password?: string | null
          password_hash?: string | null
          phone_number: string
          position: string
          province: string
          region: string
          rejection_reason?: string | null
          status?: string
          submitted_at?: string
          suffix?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          barangay?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_approved?: boolean
          landline_number?: string | null
          last_name?: string
          middle_name?: string | null
          municipality?: string
          original_password?: string | null
          password_hash?: string | null
          phone_number?: string
          position?: string
          province?: string
          region?: string
          rejection_reason?: string | null
          status?: string
          submitted_at?: string
          suffix?: string | null
          updated_at?: string
          user_id?: string | null
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
          created_by: string | null
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
          sku: string
          sold_count: number | null
          specifications: Json | null
          stock_quantity: number
          tags: string[] | null
          title: string | null
          updated_at: string
          vendor_id: string
          weight_kg: number | null
        }
        Insert: {
          average_rating?: number | null
          brand?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
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
          sku?: string
          sold_count?: number | null
          specifications?: Json | null
          stock_quantity?: number
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          vendor_id: string
          weight_kg?: number | null
        }
        Update: {
          average_rating?: number | null
          brand?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
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
          sku?: string
          sold_count?: number | null
          specifications?: Json | null
          stock_quantity?: number
          tags?: string[] | null
          title?: string | null
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
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          email: string | null
          first_name: string | null
          id: string
          invited_by: string | null
          is_approved: boolean | null
          landline_number: string | null
          last_login: string | null
          last_name: string | null
          logo_url: string | null
          middle_name: string | null
          mpin: string | null
          municipality: string | null
          officials_data: Json | null
          phone_number: string | null
          position: string | null
          province: string | null
          region: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: string | null
          suffix: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          barangay?: string | null
          "Barangay Reference"?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          invited_by?: string | null
          is_approved?: boolean | null
          landline_number?: string | null
          last_login?: string | null
          last_name?: string | null
          logo_url?: string | null
          middle_name?: string | null
          mpin?: string | null
          municipality?: string | null
          officials_data?: Json | null
          phone_number?: string | null
          position?: string | null
          province?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
          suffix?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          barangay?: string | null
          "Barangay Reference"?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          invited_by?: string | null
          is_approved?: boolean | null
          landline_number?: string | null
          last_login?: string | null
          last_name?: string | null
          logo_url?: string | null
          middle_name?: string | null
          mpin?: string | null
          municipality?: string | null
          officials_data?: Json | null
          phone_number?: string | null
          position?: string | null
          province?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
          suffix?: string | null
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
      rbi_forms: {
        Row: {
          admin_notes: string | null
          barangay_id: string | null
          decision_precedence: number | null
          form_data: Json
          id: string
          rbi_number: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_type: string | null
          status: Database["public"]["Enums"]["rbi_status"]
          submitted_at: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          barangay_id?: string | null
          decision_precedence?: number | null
          form_data: Json
          id?: string
          rbi_number?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_type?: string | null
          status?: Database["public"]["Enums"]["rbi_status"]
          submitted_at?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          barangay_id?: string | null
          decision_precedence?: number | null
          form_data?: Json
          id?: string
          rbi_number?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_type?: string | null
          status?: Database["public"]["Enums"]["rbi_status"]
          submitted_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rbi_sequences: {
        Row: {
          barangay_code: string
          created_at: string | null
          id: string
          last_sequence: number
          updated_at: string | null
          year: number
        }
        Insert: {
          barangay_code: string
          created_at?: string | null
          id?: string
          last_sequence?: number
          updated_at?: string | null
          year: number
        }
        Update: {
          barangay_code?: string
          created_at?: string | null
          id?: string
          last_sequence?: number
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      "REGION 1": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 10": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 11": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 12": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 13": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 2": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 3": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 4A": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 4B": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 5": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 6": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 7": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 8": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Relationships: []
      }
      "REGION 9": {
        Row: {
          BARANGAY: string | null
          "BARANGAY HALL TELNO": string | null
          "CITY/MUNICIPALITY": string | null
          FIRSTNAME: string | null
          LASTNAME: string | null
          MIDDLENAME: string | null
          POSITION: string | null
          PROVINCE: string | null
          REGION: string | null
          SUFFIX: string | null
          TERM: string | null
        }
        Insert: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
        }
        Update: {
          BARANGAY?: string | null
          "BARANGAY HALL TELNO"?: string | null
          "CITY/MUNICIPALITY"?: string | null
          FIRSTNAME?: string | null
          LASTNAME?: string | null
          MIDDLENAME?: string | null
          POSITION?: string | null
          PROVINCE?: string | null
          REGION?: string | null
          SUFFIX?: string | null
          TERM?: string | null
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
      services: {
        Row: {
          barangay_id: string
          contact_info: Json | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          requirements: string[] | null
          service_type: string
          title: string
          updated_at: string
        }
        Insert: {
          barangay_id: string
          contact_info?: Json | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          requirements?: string[] | null
          service_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          barangay_id?: string
          contact_info?: Json | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          requirements?: string[] | null
          service_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      user_devices: {
        Row: {
          created_at: string | null
          device_info: Json | null
          id: string
          is_active: boolean | null
          mpin: string | null
          phone_number: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          is_active?: boolean | null
          mpin?: string | null
          phone_number?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          is_active?: boolean | null
          mpin?: string | null
          phone_number?: string | null
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
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_official: {
        Args: { official_id: string }
        Returns: undefined
      }
      approve_official_complete: {
        Args: { official_id: string }
        Returns: string
      }
      approve_official_direct: {
        Args: { official_id: string }
        Returns: string
      }
      approve_official_simple: {
        Args: { official_id: string }
        Returns: string
      }
      approve_official_with_profile: {
        Args: { official_id: string }
        Returns: string
      }
      create_barangay_from_region_data: {
        Args: {
          barangay_name: string
          municipality_name: string
          province_name: string
          region_name: string
        }
        Returns: string
      }
      fix_approved_officials: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      fix_existing_approved_officials: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      fix_specific_official: {
        Args: { official_id: string }
        Returns: string
      }
      generate_job_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_product_sku: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_rbi_number: {
        Args: { user_barangay_name: string }
        Returns: string
      }
      get_barangay_by_name: {
        Args: { barangay_name: string }
        Returns: Json
      }
      get_region_table_name: {
        Args: { region_name: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      handle_new_user_signup: {
        Args: Record<PropertyKey, never> | { user_data: Json }
        Returns: undefined
      }
      hash_mpin: {
        Args: { mpin_text: string }
        Returns: string
      }
      hash_password: {
        Args: { password_text: string }
        Returns: string
      }
      insert_profile: {
        Args: { email: string; id: string }
        Returns: undefined
      }
      is_approved_official: {
        Args: { user_id: string }
        Returns: boolean
      }
      link_approved_officials: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      sync_approved_officials_to_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      test_approval: {
        Args: { official_id: string }
        Returns: string
      }
      test_edge_function_call: {
        Args: { official_id: string }
        Returns: string
      }
      update_role_user_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_last_login: {
        Args: { user_id: string }
        Returns: undefined
      }
      update_user_mpin: {
        Args: { new_mpin: string; user_id: string }
        Returns: undefined
      }
      verify_mpin: {
        Args: { mpin_hash: string; mpin_text: string }
        Returns: boolean
      }
      verify_official_password: {
        Args: { official_id: string; password_text: string }
        Returns: boolean
      }
      verify_password: {
        Args: { password_hash: string; password_text: string }
        Returns: boolean
      }
      verify_user_mpin: {
        Args: { mpin_input: string; user_email: string }
        Returns: Json
      }
    }
    Enums: {
      rbi_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "pending_documents"
      user_role: "resident" | "official" | "superadmin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      rbi_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "pending_documents",
      ],
      user_role: ["resident", "official", "superadmin"],
    },
  },
} as const
