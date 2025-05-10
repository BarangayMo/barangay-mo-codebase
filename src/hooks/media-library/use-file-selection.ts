
import { useState, useCallback } from "react";
import { MediaFile } from "./types";

export function useFileSelection() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  
  // Toggle selection of a single file
  const toggleFileSelection = useCallback((fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  }, []);

  // Toggle selection of all files
  const toggleAllFiles = useCallback((mediaFiles: MediaFile[] | undefined) => {
    if (!mediaFiles) return;
    
    setSelectedFiles(prev =>
      prev.length === mediaFiles.length 
        ? [] 
        : mediaFiles.map(file => file.id)
    );
  }, []);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  return {
    selectedFiles,
    toggleFileSelection,
    toggleAllFiles,
    clearSelections,
  };
}
