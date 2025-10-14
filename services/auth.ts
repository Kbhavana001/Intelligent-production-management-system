export type UserRole = 'manufacturer' | 'vendor';

export type User = {
  id?: string;
  username: string;
  role: UserRole;
  displayName?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function handleJsonResponse(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text || '{}');
  } catch (e) {
    return { text };
  }
}

export const auth = {
  loginWithCredentials: async (username: string, password: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const body = await handleJsonResponse(res);
      throw new Error(body?.error || 'Login failed');
    }
    const body = await res.json();
    return body as User;
  },

  loginWithRole: async (role: UserRole): Promise<User> => {
    // For demo compatibility: use pre-seeded usernames
    const username = role === 'manufacturer' ? 'manufacturer' : 'vendor';
    // default password for seeded users
    return auth.loginWithCredentials(username, 'pass123');
  },

  signup: async (username: string, password: string, role: UserRole, displayName?: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role, display_name: displayName })
    });
    if (!res.ok) {
      const body = await handleJsonResponse(res);
      throw new Error(body?.error || 'Signup failed');
    }
    return await res.json() as User;
  },

  logout: async () => {
    await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' });
  },

  getCurrentUser: async (): Promise<User | null> => {
    const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' });
    if (!res.ok) return null;
    const body = await res.json();
    return body as User;
  }
};
