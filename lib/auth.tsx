'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; role: UserRole }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try { return JSON.parse(stored); } catch { return null; }
      }
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('token');
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (currentToken && currentToken.startsWith('demo-token-')) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          return;
        }
      }

      const res = await api.get('/auth/me');
      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  useEffect(() => {
    // Always attempt to refresh the user session on mount, as OAuth logins 
    // set server cookies without touching localStorage tokens.
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    if (password === 'password123') {
      const cleanEmail = email.trim().toLowerCase();
      let role: UserRole | null = null;
      if (cleanEmail === 'admin@donateconnect.com') role = UserRole.ADMIN;
      else if (cleanEmail === 'rahul@example.com') role = UserRole.DONOR;
      else if (cleanEmail === 'helping@example.com') role = UserRole.NGO;
      else if (cleanEmail === 'beneficiary@example.com') role = UserRole.BENEFICIARY;

      if (role) {
        const mockUser: User = {
          id: 'demo-' + role.toLowerCase(),
          name: role.charAt(0) + role.slice(1).toLowerCase() + ' Demo',
          email,
          role,
          isVerified: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const mockToken = 'demo-token-' + role;
        
        setUser(mockUser);
        setToken(mockToken);
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        if (typeof document !== 'undefined') {
          document.cookie = `demo_role_override=${role}; path=/; max-age=86400`;
        }
        return;
      }
    }

    const res = await api.post('/auth/login', { email, password });
    const { user: u, token: t } = res.data.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; role: UserRole }) => {
    const res = await api.post('/auth/register', data);
    const { user: u, token: t } = res.data.data;
    setUser(u);
    setToken(t);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
