import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Login } from '../components/Login';
import { Signup } from '../components/Signup';
import { Dashboard } from '../components/Dashboard';
import { DataUploader } from '../components/DataUploader';
import { ManufacturerDashboard } from '../components/ManufacturerDashboard';
import { VendorDashboard } from '../components/VendorDashboard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { VendorSubmittedFeedback } from '../types';

const App: React.FC = () => {
  const [user, setUser] = useState<{ username: string; roles: string[]; authenticated: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendorFeedback, setVendorFeedback] = useState<VendorSubmittedFeedback[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user/info');
        if (response.ok) {
          const userInfo = await response.json();
          setUser(userInfo);
          if (userInfo.authenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
            navigate('/dashboard');
          }
        } else {
          setUser({ authenticated: false, username: '', roles: [] });
        }
      } catch (error) {
        console.error('Failed to fetch user info', error);
        setUser({ authenticated: false, username: '', roles: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    await fetch('/perform_logout', { method: 'POST' });
    setUser(null);
    navigate('/login');
  };

  const handleFeedbackSubmit = (feedback: VendorSubmittedFeedback) => {
    setVendorFeedback(prev => [...prev, feedback]);
  };

  const handleDataUpload = (data: any[]) => {
    // Handle uploaded data for generic users
    console.log('Data uploaded:', data.length, 'records');
  };

  // Check if user is manufacturer or vendor
  const isManufacturer = user?.roles?.some(role => role === 'ROLE_MANUFACTURER');
  const isVendor = user?.roles?.some(role => role === 'ROLE_VENDOR');

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (!user?.authenticated && location.pathname !== '/login' && location.pathname !== '/signup') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/*" element={
        <>
          {isManufacturer ? (
            <ManufacturerDashboard onLogout={handleLogout} vendorFeedback={vendorFeedback} />
          ) : isVendor ? (
            <VendorDashboard onLogout={handleLogout} onFeedbackSubmit={handleFeedbackSubmit} />
          ) : (
            <div className="min-h-screen bg-gray-900 text-white">
              <Header onLogout={handleLogout} />
              <main>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/upload" element={<DataUploader onDataUploaded={handleDataUpload} />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          )}
        </>
      } />
    </Routes>
  );
};

export default App;
