
import { User } from "@supabase/supabase-js";

export interface MediaBucket {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  public: boolean;
}

export interface MediaFile {
  id: string;
  user_id?: string;
  filename: string;
  alt_text?: string;
  uploaded_at: string;
  file_size: number;
  content_type: string;
  bucket_name: string;
  file_url: string;
  references?: number;
  signedUrl?: string;
  category?: string;
}

export interface MediaLibraryFilters {
  user: string | null;
  category: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

export interface FileOperation {
  success: boolean;
  message?: string;
  file?: MediaFile;
}
