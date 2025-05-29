
import { useEffect, useState, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { bytesToSize } from "@/lib/utils";
import { useMediaLibrary } from "@/hooks";
import { MediaDetailsDialog } from "./grid/MediaDetailsDialog";
import { DeleteConfirmDialog } from "./grid/DeleteConfirmDialog";
import { MediaFile } from "@/hooks/media-library/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

// Define types for our profiles
interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface MediaFileWithProfile extends MediaFile {
  profile?: Profile | null;
}

interface MediaLibraryFilters {
  user: string | null;
  category: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface MediaLibraryTableProps {
  filters?: MediaLibraryFilters;
  searchQuery?: string;
  uploadingFiles?: any[];
}

export function MediaLibraryTable({ 
  filters = { user: null, category: null, startDate: null, endDate: null }, 
  searchQuery = "",
  uploadingFiles = []
}: MediaLibraryTableProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaFileWithProfile | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const lastSelectedIndex = useRef<number | null>(null);

  const {
    mediaFiles: files,
    selectedFiles,
    loadingFiles: isLoading,
    isError,
    error,
    deletingFiles,
    isDeleting,
    toggleFileSelection,
    toggleAllFiles,
    clearSelections,
    handleDownload,
    handleDelete,
    handleCopyUrl,
    refetch
  } = useMediaLibrary(filters, searchQuery);

  // For debugging purposes
  useEffect(() => {
    if (files) {
      console.log("MediaLibraryTable received files:", files.length);
      if (files.length > 0) {
        console.log("Sample file:", files[0]);
      }
    }
  }, [files]);

  // Enhanced toggle function with range selection support
  const handleToggleFileSelection = (file: MediaFile, index: number, event: React.MouseEvent) => {
    if ((event.shiftKey || event.metaKey || event.ctrlKey) && lastSelectedIndex.current !== null && files) {
      // Range selection
      const start = Math.min(lastSelectedIndex.current, index);
      const end = Math.max(lastSelectedIndex.current, index);
      
      // Select all files in the range
      for (let i = start; i <= end; i++) {
        const fileInRange = files[i];
        if (fileInRange && !selectedFiles.includes(fileInRange.id)) {
          toggleFileSelection(fileInRange.id);
        }
      }
    } else {
      // Single selection
      toggleFileSelection(file.id);
      lastSelectedIndex.current = index;
    }
  };

  // Handler for bulk delete
  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;

    const filesToDelete = files?.filter(file => selectedFiles.includes(file.id)) || [];
    
    for (const file of filesToDelete) {
      await handleDelete(
        file.id,
        file.bucket_name || 'user_uploads',
        file.file_url
      );
    }
    
    clearSelections();
    setBulkDeleteOpen(false);
  };

  // Add function to update file metadata
  const handleUpdateFile = async (fileId: string, updates: { filename?: string; alt_text?: string }) => {
    try {
      const { error } = await supabase
        .from('media_files')
        .update(updates)
        .eq('id', fileId);

      if (error) throw error;

      toast.success('File updated successfully');
      refetch(); // Refresh the media list
      
      // Update the selected media if it's the same file
      if (selectedMedia && selectedMedia.id === fileId) {
        setSelectedMedia({ ...selectedMedia, ...updates });
      }
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Failed to update file');
    }
  };

  // Handler for deleting the selected media
  const handleConfirmDelete = () => {
    if (selectedMedia) {
      handleDelete(
        selectedMedia.id,
        selectedMedia.bucket_name || 'user_uploads',
        selectedMedia.file_url
      );
      setSelectedMedia(null);
      setDeleteConfirmOpen(false);
    }
  };

  // Handle row click with enhanced selection support
  const handleRowClick = (file: MediaFile, index: number, e: React.MouseEvent) => {
    // Don't open dialog if clicking on checkbox
    if ((e.target as HTMLElement).closest('[data-checkbox]')) {
      return;
    }
    
    // Check if we're in selection mode (any files selected)
    if (selectedFiles.length > 0 || e.shiftKey || e.metaKey || e.ctrlKey) {
      handleToggleFileSelection(file, index, e);
      return;
    }
    
    setSelectedMedia(file as MediaFileWithProfile);
  };

  // Combine actual files with uploading files for display
  const allFiles = [...(files || []), ...uploadingFiles.map(upload => ({
    id: upload.id,
    filename: upload.file.name,
    file_url: '',
    bucket_name: 'user_uploads',
    content_type: upload.file.type,
    file_size: upload.file.size,
    uploaded_at: new Date().toISOString(),
    user_id: '',
    category: 'uploading',
    signedUrl: null,
    isUploading: true,
    progress: upload.progress
  }))];

  const deletingCount = deletingFiles.size;
  const allSelected = files && files.length > 0 && selectedFiles.length === files.length;
  const someSelected = selectedFiles.length > 0 && files && selectedFiles.length < files.length;

  if (isError) {
    console.error("Query error:", error);
    return <div className="p-8 text-center border rounded-lg bg-red-50 text-red-700">
      <p className="font-medium">Error loading media</p>
      <p className="text-sm mt-1">Please check the console for details.</p>
    </div>;
  }

  if (isLoading) return <div className="flex items-center justify-center h-64">
    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>;

  if (!allFiles || allFiles.length === 0) return <div className="text-center py-16 border rounded-lg bg-gray-50">
    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
    </div>
    <h3 className="mt-4 text-lg font-medium text-gray-900">No media found</h3>
    <p className="mt-1 text-sm text-gray-500">Upload some files or adjust your filters to see media here.</p>
  </div>;

  return (
    <>
      {/* Loading overlay when deleting files - with dynamic count */}
      {deletingCount > 0 && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">
                Deleting {deletingCount} file{deletingCount > 1 ? 's' : ''}...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bulk selection header - only show when items are selected */}
      {selectedFiles.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allSelected}
              onCheckedChange={() => toggleAllFiles(files)}
              className={`${someSelected ? "data-[state=checked]:bg-blue-500" : ""} data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-4 w-4`}
            />
            <span className="text-sm font-medium text-blue-800">
              {selectedFiles.length > 0 
                ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
                : 'Select all files'
              }
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelections}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              Clear Selection
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteOpen(true)}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedFiles.length})
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={allSelected}
                    onCheckedChange={() => toggleAllFiles(files)}
                    className="h-4 w-4"
                  />
                </TableHead>
                <TableHead>File name</TableHead>
                <TableHead>Alt text</TableHead>
                <TableHead>Date added</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>References</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allFiles.map((file, index) => (
                <TableRow 
                  key={file.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={(e) => !file.isUploading && handleRowClick(file, index, e)}
                >
                  <TableCell>
                    <div data-checkbox onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={(e) => !file.isUploading && handleToggleFileSelection(file, index, e as any)}
                        className="h-4 w-4"
                        disabled={file.isUploading}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center relative">
                      {file.isUploading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <img 
                          src={file.signedUrl || ''} 
                          alt={file.alt_text || file.filename}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            console.error('Image load error:', file.signedUrl);
                            e.currentTarget.style.display = 'none';
                            const icon = document.createElement('div');
                            icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-6 h-6 text-gray-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>';
                            e.currentTarget.parentElement?.appendChild(icon);
                          }}
                        />
                      )}
                      {isDeleting(file.id) && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{file.filename}</p>
                      <p className="text-sm text-gray-500">{file.filename.split('.').pop()?.toUpperCase()}</p>
                      {file.isUploading && (
                        <div className="mt-1">
                          <Progress value={file.progress} className="h-1" />
                          <p className="text-xs text-blue-600 mt-1">{file.progress}% uploaded</p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{file.alt_text || '—'}</TableCell>
                  <TableCell>
                    {file.isUploading ? (
                      <span className="text-blue-600 text-sm">Uploading...</span>
                    ) : (
                      formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })
                    )}
                  </TableCell>
                  <TableCell>{bytesToSize(file.file_size)}</TableCell>
                  <TableCell>{file.references || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Media details dialog */}
      <MediaDetailsDialog 
        file={selectedMedia}
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onDelete={() => setDeleteConfirmOpen(true)}
        onDownload={handleDownload}
        onCopyUrl={handleCopyUrl}
        onUpdateFile={handleUpdateFile}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog 
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
      />

      {/* Bulk delete confirmation dialog */}
      <DeleteConfirmDialog 
        isOpen={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedFiles.length} files?`}
        description={`Are you sure you want to delete ${selectedFiles.length} selected file${selectedFiles.length > 1 ? 's' : ''}? This action cannot be undone.`}
      />
    </>
  );
}
