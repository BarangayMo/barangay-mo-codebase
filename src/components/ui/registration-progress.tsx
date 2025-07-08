
import { cn } from "@/lib/utils";

interface RegistrationProgressProps {
  currentStep: "location" | "details" | "logo";
  className?: string;
}

export function RegistrationProgress({ currentStep, className }: RegistrationProgressProps) {
  const steps = [
    { key: "location", label: "Location" },
    { key: "details", label: "Details" },
    { key: "logo", label: "Logo" }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Page Title */}
      <p className="text-xl font-bold text-gray-900 text-center">
        {steps[currentStepIndex]?.label}
      </p>
      
      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 h-1 rounded-full transition-colors",
              index <= currentStepIndex ? "bg-red-500" : "bg-gray-200"
            )}
          />
        ))}
      </div>
    </div>
  );
}
