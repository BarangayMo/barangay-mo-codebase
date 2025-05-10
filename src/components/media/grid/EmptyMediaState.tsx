
import React from "react";

interface EmptyMediaStateProps {
  isError?: boolean;
  errorMessage?: string;
}

export function EmptyMediaState({ isError = false, errorMessage }: EmptyMediaStateProps) {
  if (isError) {
    return (
      <div className="text-center py-16 border rounded-lg bg-red-50">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-red-800">Error loading media</h3>
        <p className="mt-1 text-sm text-red-600">{errorMessage || "Please check the console for details."}</p>
      </div>
    );
  }

  return (
    <div className="text-center py-16 border rounded-lg bg-gray-50">
      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No media found</h3>
      <p className="mt-1 text-sm text-gray-500">Upload some files or adjust your filters to see media here.</p>
    </div>
  );
}
