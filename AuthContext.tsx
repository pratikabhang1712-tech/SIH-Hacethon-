import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, getStoredToken, setStoredToken, clearStoredToken } from '../api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  switchRole: (role: 'student' | 'admin') => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserInState: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    setLoading(true);
    const stored = getStoredToken();
    if (stored) {
      try {
        const data = await api.getMe();
        setUser(data.user);
        setToken(stored);
      } catch (err) {
        clearStoredToken();
        setToken(null);
        setUser(null);
        // Auto demo login fallback
        await autoDemoLogin();
      }
    } else {
      await autoDemoLogin();
    }
    setLoading(false);
  };

  const autoDemoLogin = async () => {
    try {
      const data = await api.demoLogin('student');
      setStoredToken(data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (e) {
      console.error('Demo auto-login failed', e);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await api.login(email, pass);
    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (payload: any) => {
    const data = await api.register(payload);
    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  };

  const switchRole = async (role: 'student' | 'admin') => {
    setLoading(true);
    try {
      const data = await api.demoLogin(role);
      setStoredToken(data.token);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch (e) {
      console.error('Refresh user error', e);
    }
  };

  const updateUserInState = (updated: User) => {
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        switchRole,
        refreshUser,
        updateUserInState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
