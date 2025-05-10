
// Extend the existing types.ts file - Create it if it doesn't exist
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

export interface FileOperationResult {
  success: boolean;
  error?: any;
  message?: string;
}

export type MediaViewMode = 'grid' | 'list';

export type MediaSortOption = 'name' | 'date' | 'size';
export type SortDirection = 'asc' | 'desc';

export type FileSelectionMode = 'single' | 'multiple';
