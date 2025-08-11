import type { Database as SupabaseDatabase } from "@/integrations/supabase/types";

export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MediaFile = SupabaseDatabase['public']['Tables']['media_files']['Row'] & {
  bucket_name?: string;
  signedUrl?: string;
  references?: number;
};

export interface MediaBucket {
  id: string;
  name: string;
  public: boolean;
  file_size_limit?: number;
  allowed_mime_types?: string[];
  created_at: string;
  updated_at: string;
}

export interface MediaLibraryFilters {
  category?: string;
  content_type?: string;
  user_id?: string;
  user?: string;
  search?: string;
  bucket?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  sort_by?: 'uploaded_at' | 'filename' | 'file_size';
  sort_order?: 'asc' | 'desc';
}

export interface MediaFileWithProfile extends Omit<MediaFile, 'bucket_name'> {
  bucket_name?: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}