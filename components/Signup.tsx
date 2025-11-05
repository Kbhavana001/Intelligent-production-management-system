import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from './common/Icon';
import { Card } from './common/Card';

export const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'manufacturer' | 'vendor'>('manufacturer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long!');
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          email,
          role: role.toUpperCase(),
        }),
      });

      if (response.ok) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorData = await response.text();
        setError(errorData || 'Signup failed. Username may already exist.');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900 text-gray-200">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <Icon type="chart" className="w-8 h-8 text-blue-400" />
            Create Your Account
          </h1>
          <p className="text-md text-gray-400 mt-2">Join the Intelligent Production Management System</p>
        </div>
        <Card className="bg-gray-800 p-8">
          <form onSubmit={handleSignup} className="space-y-6">
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
                placeholder="Enter a unique username"
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="your.email@example.com"
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
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Re-enter your password"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500"
            >
              Create Account
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
