
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { bytesToSize } from "@/lib/utils";

interface MediaFile {
  id: string;
  filename: string;
  alt_text?: string;
  uploaded_at: string;
  file_size: number;
  references?: number;
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
}

export function MediaLibraryTable({ filters = {}, searchQuery = "" }: MediaLibraryTableProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const { data: files, isLoading } = useQuery({
    queryKey: ['media-files', filters, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('media_files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (filters.user) query = query.eq('user_id', filters.user);
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.startDate) query = query.gte('uploaded_at', filters.startDate);
      if (filters.endDate) query = query.lte('uploaded_at', filters.endDate);
      
      if (searchQuery) {
        query = query.ilike('filename', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MediaFile[];
    }
  });

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleAllFiles = () => {
    if (files) {
      setSelectedFiles(
        selectedFiles.length === files.length 
          ? [] 
          : files.map(file => file.id)
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;

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
          {files?.map((file) => (
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
                    src={supabase.storage.from('user_uploads').getPublicUrl(file.filename).data.publicUrl} 
                    alt={file.alt_text || file.filename}
                    className="max-w-full max-h-full object-contain"
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
