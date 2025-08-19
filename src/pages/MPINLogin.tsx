import React from 'react';
import { MPINLogin as MPINLoginComponent } from '@/components/auth/MPINLogin';

const MPINLogin: React.FC = () => {
  const handleLoginSuccess = () => {
    // The auth context will handle the redirection based on user role
    // We don't need to do anything here as the redirect will happen automatically
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Smart Barangay</h1>
          <p className="text-gray-600">Quick and secure access</p>
        </div>
        
        <MPINLoginComponent onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default MPINLogin;