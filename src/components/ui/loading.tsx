
import { Loader } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-600 animate-pulse">Loading...</p>
      </div>
    </div>
  );
};
