
import React, { useState } from 'react';
import { Icon } from './common/Icon';
import { Card } from './common/Card';
import { useAuth } from '../src/AuthContext';

export const Login: React.FC = () => {
  const { login, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'manufacturer' | 'vendor'>('manufacturer');

  const handleRoleQuick = async (roleParam: 'manufacturer' | 'vendor') => {
    setError(null);
    setLoading(true);
    try {
      // demo shortcut uses seeded credentials handled in auth.loginWithRole
      const authSvc = await import('../services/auth');
      await authSvc.auth.loginWithRole(roleParam);
    } catch (e: any) {
      setError(e?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await signup(username, password, role, displayName);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Action failed');
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <button type="button" onClick={() => setMode('login')} className={`flex-1 py-2 rounded ${mode==='login'? 'bg-blue-600':'bg-gray-700'}`}>Login</button>
              <button type="button" onClick={() => setMode('signup')} className={`flex-1 py-2 rounded ${mode==='signup'? 'bg-blue-600':'bg-gray-700'}`}>Signup</button>
            </div>

            <div>
              <label className="text-sm text-gray-400">Username</label>
              <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full mt-1 p-2 rounded bg-gray-900 text-white" />
            </div>

            <div>
              <label className="text-sm text-gray-400">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-1 p-2 rounded bg-gray-900 text-white" />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-sm text-gray-400">Display name</label>
                <input value={displayName} onChange={e=>setDisplayName(e.target.value)} className="w-full mt-1 p-2 rounded bg-gray-900 text-white" />
              </div>
            )}

            <div>
              <label className="text-sm text-gray-400">Role</label>
              <select value={role} onChange={e=>setRole(e.target.value as any)} className="w-full mt-1 p-2 rounded bg-gray-900 text-white">
                <option value="manufacturer">Manufacturer</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg" disabled={loading}>{loading ? 'Working...' : (mode==='login'?'Login':'Signup')}</button>
            </div>

            <div className="mt-2 text-sm text-gray-400">Or use quick demo buttons:</div>
            <div className="flex gap-2">
              <button type="button" onClick={()=>handleRoleQuick('manufacturer')} className="flex-1 bg-blue-500 py-2 rounded">Demo Manufacturer</button>
              <button type="button" onClick={()=>handleRoleQuick('vendor')} className="flex-1 bg-gray-600 py-2 rounded">Demo Vendor</button>
            </div>

            {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
          </form>
        </Card>
      </div>
    </div>
  );
};
