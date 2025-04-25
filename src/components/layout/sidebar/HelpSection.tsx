
import { Home } from "lucide-react";

export const HelpSection = () => {
  return (
    <div className="px-3 mt-auto">
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Home className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Need help?</p>
            <p className="text-xs text-gray-500">Contact support</p>
          </div>
        </div>
      </div>
    </div>
  );
};
