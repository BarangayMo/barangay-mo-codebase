
import React, { createContext, useContext } from 'react';
import { useEnhancedToast } from './enhanced-toast';

interface EnhancedToastContextType {
  showToast: ReturnType<typeof useEnhancedToast>['showToast'];
}

const EnhancedToastContext = createContext<EnhancedToastContextType | undefined>(undefined);

export const EnhancedToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast, ToastContainer } = useEnhancedToast();

  return (
    <EnhancedToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer />
    </EnhancedToastContext.Provider>
  );
};

export const useEnhancedToastContext = () => {
  const context = useContext(EnhancedToastContext);
  if (context === undefined) {
    throw new Error('useEnhancedToastContext must be used within an EnhancedToastProvider');
  }
  return context;
};
