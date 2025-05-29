
import { useState } from "react";

export function useDeleteState() {
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());

  const setDeleting = (fileId: string, isDeleting: boolean) => {
    setDeletingFiles(prev => {
      const newSet = new Set(prev);
      if (isDeleting) {
        newSet.add(fileId);
      } else {
        newSet.delete(fileId);
      }
      return newSet;
    });
  };

  const isDeleting = (fileId: string) => deletingFiles.has(fileId);

  return {
    deletingFiles,
    setDeleting,
    isDeleting
  };
}
