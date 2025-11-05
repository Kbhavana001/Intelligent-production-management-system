
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from './common/Icon';
import { Card } from './common/Card';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'manufacturer' | 'vendor' | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select your role (Manufacturer or Vendor) to continue.');
      return;
    }

  // Use application/x-www-form-urlencoded to be fully compatible with Spring Security
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

    try {
      const response = await fetch('/perform_login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        redirect: 'follow',
      });

      // Spring Security returns 302 on successful form login.
      // Treat redirects as success and navigate to the SPA dashboard.
      if (response.ok || response.redirected || response.status === 302) {
        // Verify the authenticated user's role matches the selected role
        try {
          const infoRes = await fetch('/api/user/info');
          if (infoRes.ok) {
            const info = await infoRes.json();
            const hasManufacturer = info?.roles?.includes('ROLE_MANUFACTURER');
            const hasVendor = info?.roles?.includes('ROLE_VENDOR');
            const matches = (role === 'manufacturer' && hasManufacturer) || (role === 'vendor' && hasVendor);
            if (!matches) {
              // Logout and show error
              await fetch('/perform_logout', { method: 'POST' });
              setError(`This account does not have the ${role === 'manufacturer' ? 'MANUFACTURER' : 'VENDOR'} role.`);
              return;
            }
          }
        } catch (_) {
          // ignore; fallback to navigation
        }
        navigate('/dashboard');
        return;
      }

      // If redirected back to login with error flag, show message.
      if (response.url && response.url.includes('error=true')) {
        setError('Invalid credentials. Please try again.');
        return;
      }

      // Fallback generic message
      setError('Login failed. Please try again.');
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleDemoLogin = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    if (demoUsername === 'manufacturer') setRole('manufacturer');
    if (demoUsername === 'vendor') setRole('vendor');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900 text-gray-200">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <Icon type="chart" className="w-8 h-8 text-blue-400" />
            Intelligent Production Management System
          </h1>
          <p className="text-md text-gray-400 mt-2">Please select your role to continue.</p>
        </div>
        <Card className="bg-gray-800 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`py-3 px-4 rounded-md transition-colors font-semibold ${
                    role === 'manufacturer'
                      ? 'bg-blue-600 text-white border-2 border-blue-500'
                      : 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setRole('manufacturer')}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon type="chart" className="w-5 h-5" />
                    <span>Manufacturer</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`py-3 px-4 rounded-md transition-colors font-semibold ${
                    role === 'vendor'
                      ? 'bg-blue-600 text-white border-2 border-blue-500'
                      : 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setRole('vendor')}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon type="dollar" className="w-5 h-5" />
                    <span>Vendor</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">
                <p className="font-semibold">Login Failed</p>
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!role}
              className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 ${
                role ? 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500' : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Login
            </button>

            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3 text-center">Quick demo logins:</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('manufacturer', 'manu123')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm"
                >
                  Manufacturer Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('vendor', 'vendor123')}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm"
                >
                  Vendor Demo
                </button>
              </div>
            </div>

            <div className="text-center mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
