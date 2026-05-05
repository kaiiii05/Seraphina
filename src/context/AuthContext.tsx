/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  memberSince: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'seraphina_user_session';

function readStoredUser(): User | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== 'object') return null;
    const { name, email, memberSince } = data as Partial<User>;
    if (
      typeof name === 'string' &&
      typeof email === 'string' &&
      typeof memberSince === 'string'
    ) {
      return { name, email, memberSince };
    }
    return null;
  } catch {
    return null;
  }
}

function persistUser(user: User | null) {
  try {
    if (typeof localStorage === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* storage disabled or quota */
  }
}

function displayNameFromEmail(email: string): string {
  const local = email.trim().split('@')[0] ?? '';
  if (!local) return 'Member';
  const words = local.replace(/[._-]+/g, ' ').split(/\s+/).filter(Boolean);
  const titled = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  return titled || 'Member';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => readStoredUser());

  const setUser = (next: User | null) => {
    setUserState(next);
    persistUser(next);
  };

  const getMemberSinceLabel = () =>
    new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const login = (email: string, password: string) => {
    if (!password.trim()) {
      return;
    }
    setUser({
      name: displayNameFromEmail(email),
      email: email.trim(),
      memberSince: getMemberSinceLabel(),
    });
  };

  const register = (name: string, email: string, password: string) => {
    if (!password.trim()) {
      return;
    }
    setUser({
      name: name.trim() || displayNameFromEmail(email),
      email: email.trim(),
      memberSince: getMemberSinceLabel(),
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
