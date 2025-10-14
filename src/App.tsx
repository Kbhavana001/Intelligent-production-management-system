
import React, { useState } from 'react';
import { Login } from '../components/Login';
import { ManufacturerDashboard } from '../components/ManufacturerDashboard';
import { VendorDashboard } from '../components/VendorDashboard';
import type { VendorSubmittedFeedback } from '../types';
import { AuthProvider, useAuth } from './AuthContext';

const InnerApp: React.FC = () => {
  const { user, logout } = useAuth();
  const [vendorFeedback, setVendorFeedback] = useState<VendorSubmittedFeedback[]>([]);

  const handleLogout = () => {
    logout();
  };
  
  const handleFeedbackSubmit = (feedback: VendorSubmittedFeedback) => {
    setVendorFeedback(prev => [...prev, feedback]);
  };

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      {user.role === 'manufacturer' && (
        <ManufacturerDashboard onLogout={handleLogout} vendorFeedback={vendorFeedback} />
      )}
      {user.role === 'vendor' && (
        <VendorDashboard onLogout={handleLogout} onFeedbackSubmit={handleFeedbackSubmit} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
};

export default App;
