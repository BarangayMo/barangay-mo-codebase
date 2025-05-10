
import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { bytesToSize } from "@/lib/utils";
import { useMediaLibrary } from "@/hooks/use-media-library";

interface MediaLibraryFilters {
  user: string | null;
  category: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface MediaLibraryTableProps {
  filters?: MediaLibraryFilters;
  searchQuery?: string;
}

export function MediaLibraryTable({ 
  filters = { user: null, category: null, startDate: null, endDate: null }, 
  searchQuery = "" 
}: MediaLibraryTableProps) {
  const {
    mediaFiles: files,
    selectedFiles,
    loadingFiles: isLoading,
    isError,
    error,
    toggleFileSelection,
    toggleAllFiles
  } = useMediaLibrary(filters, searchQuery);

  // For debugging purposes
  useEffect(() => {
    if (files) {
      console.log("MediaLibraryTable received files:", files.length);
      console.log("Sample file:", files[0]);
    }
  }, [files]);

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

  if (!files || files.length === 0) return <div className="text-center py-16 border rounded-lg bg-gray-50">
    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
    </div>
    <h3 className="mt-4 text-lg font-medium text-gray-900">No media found</h3>
    <p className="mt-1 text-sm text-gray-500">Upload some files or adjust your filters to see media here.</p>
  </div>;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={files && files.length > 0 && selectedFiles.length === files.length}
                onCheckedChange={toggleAllFiles}
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
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedFiles.includes(file.id)}
                  onCheckedChange={() => toggleFileSelection(file.id)}
                />
              </TableCell>
              <TableCell className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
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
                </div>
                <div>
                  <p className="font-medium">{file.filename}</p>
                  <p className="text-sm text-gray-500">{file.filename.split('.').pop()?.toUpperCase()}</p>
                </div>
              </TableCell>
              <TableCell>{file.alt_text || '—'}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}</TableCell>
              <TableCell>{bytesToSize(file.file_size)}</TableCell>
              <TableCell>{file.references || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
