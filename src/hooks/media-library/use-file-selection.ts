
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
  const toggleAllFiles = useCallback((mediaFiles?: MediaFile[]) => {
    if (!mediaFiles) return;
    
    setSelectedFiles(prev =>
      prev.length === mediaFiles.length 
        ? [] 
        : mediaFiles.map(file => file.id)
    );
  }, []);

  // Modified toggleAllFiles function that doesn't require parameters
  // This is for direct use with Checkbox onCheckedChange
  const toggleAllFilesSimple = useCallback(() => {
    setSelectedFiles(prev => prev.length > 0 ? [] : []);
  }, []);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  return {
    selectedFiles,
    toggleFileSelection,
    toggleAllFiles,
    toggleAllFilesSimple,
    clearSelections,
  };
}
