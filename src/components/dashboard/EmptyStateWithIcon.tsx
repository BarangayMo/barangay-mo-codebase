
import { ReactNode } from "react";

interface EmptyStateWithIconProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const EmptyStateWithIcon = ({ icon, title, description, className = "" }: EmptyStateWithIconProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="mb-4 p-4 rounded-full bg-gray-100">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm">{description}</p>
    </div>
  );
};
