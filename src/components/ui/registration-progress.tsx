
import React from 'react';

interface RegistrationProgressProps {
  currentStep: 'role' | 'location' | 'details' | 'logo' | 'register';
}

export function RegistrationProgress({ currentStep }: RegistrationProgressProps) {
  const steps = [
    { key: 'role', label: 'Role' },
    { key: 'location', label: 'Location' },
    { key: 'details', label: 'Details' },
    { key: 'logo', label: 'Logo' },
    { key: 'register', label: 'Register' }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === currentStep);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
      
      {/* Step Labels */}
      <div className="flex justify-between relative">
        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-start">
            <div 
              className={`text-xs font-medium ${
                index <= currentIndex ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
