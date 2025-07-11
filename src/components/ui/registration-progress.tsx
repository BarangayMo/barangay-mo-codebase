
import React from 'react';

interface RegistrationProgressProps {
  currentStep: 'role' | 'location' | 'details' | 'logo' | 'register';
  userRole?: 'resident' | 'official';
}

export function RegistrationProgress({ currentStep, userRole = 'resident' }: RegistrationProgressProps) {
  const residentSteps = [
    { key: 'role', label: 'Role' },
    { key: 'location', label: 'Location' },
    { key: 'register', label: 'Register' }
  ];

  const officialSteps = [
    { key: 'role', label: 'Role' },
    { key: 'location', label: 'Location' },
    { key: 'details', label: 'Details' },
    { key: 'logo', label: 'Logo' },
    { key: 'register', label: 'Register' }
  ];

  const steps = userRole === 'official' ? officialSteps : residentSteps;
  const progressColor = userRole === 'official' ? 'bg-red-600' : 'bg-blue-600';
  const textColor = userRole === 'official' ? 'text-red-600' : 'text-blue-600';

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === currentStep);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="w-full max-w-4xl">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className={`${progressColor} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
      
      {/* Step Labels */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${
                index <= currentIndex 
                  ? `${progressColor} text-white` 
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <span className="text-sm font-medium">{index + 1}</span>
            </div>
            <div 
              className={`text-sm font-medium ${
                index <= currentIndex ? textColor : 'text-gray-400'
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
