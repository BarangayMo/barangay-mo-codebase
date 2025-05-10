
// Extend the existing types.ts file
export interface MediaBucket {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  public?: boolean;
  file_size_limit?: number;
  allowed_mime_types?: string[];
  owner?: string;
  owner_id?: string;
}

export interface MediaFile {
  id?: string;
  name: string;
  size: number;
  // Add new properties that are being used by components
  filename?: string;
  file_url?: string;
  content_type?: string;
  file_size?: number;
  uploaded_at?: string;
  bucket_name?: string;
  alt_text?: string;
  references?: number;
  category?: string;
  type?: string;
  lastModified?: number;
  created_at?: string;
  updated_at?: string;
  bucket_id?: string;
  owner?: string;
  owner_id?: string;
  path?: string;
  metadata?: Record<string, any>;
  signedUrl?: string;
  user_id?: string;
}

export interface MediaLibraryFiltersType {
  user: string | null;
  category: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

export interface MediaFileWithPath extends MediaFile {
  fullPath: string;
  bucketId: string;
}

export interface FileUploadResult {
  success: boolean;
  file?: MediaFile;
  error?: any;
}

// Add the missing FileOperation interface
export interface FileOperation {
  success: boolean;
  error?: any;
  message?: string;
}

export type MediaViewMode = 'grid' | 'list';

export type MediaSortOption = 'name' | 'date' | 'size';
export type SortDirection = 'asc' | 'desc';

export type FileSelectionMode = 'single' | 'multiple';

// Define MediaFileWithProfile interface for the grid component
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

export interface MediaFileWithProfile extends MediaFile {
  profile?: Profile | null;
}

// Add MediaLibraryFilters alias to match how it's being used
export type MediaLibraryFilters = MediaLibraryFiltersType;
