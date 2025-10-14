import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { auth } from '../services/auth';
import type { User as AuthUser, UserRole } from '../services/auth';

type AuthContextValue = {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, role: UserRole, displayName?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const current = await auth.getCurrentUser();
        if (mounted) setUser(current);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const login = async (username: string, password: string) => {
    const u = await auth.loginWithCredentials(username, password);
    setUser(u);
  };

  const signup = async (username: string, password: string, role: UserRole, displayName?: string) => {
    const u = await auth.signup(username, password, role, displayName);
    setUser(u);
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
