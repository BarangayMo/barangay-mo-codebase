
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
  name?: string;
  filename: string;
  alt_text?: string;
  uploaded_at: string;
  file_size: number;
  size?: number;
  content_type: string;
  bucket_name: string;
  file_url: string;
  references?: number;
  signedUrl?: string;
  category?: string;
  // Upload-related properties
  isUploading?: boolean;
  progress?: number;
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

// Profile interface for the filters
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

// Alias for backward compatibility
export type MediaLibraryFiltersType = MediaLibraryFilters;

// Type definition for MediaFile with Profile data
export interface MediaFileWithProfile extends MediaFile {
  profile?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}
