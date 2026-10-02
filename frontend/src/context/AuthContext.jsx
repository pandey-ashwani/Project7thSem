import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('swasthya_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('swasthya_token') || null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount or when token changes
  const checkAuth = async () => {
    const storedToken = localStorage.getItem('swasthya_token');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.getMe();
      if (res?.data?.authenticated && res?.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('swasthya_user', JSON.stringify(res.data.user));
      } else {
        localStorage.removeItem('swasthya_token');
        localStorage.removeItem('swasthya_user');
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Session verification error:', error);
      localStorage.removeItem('swasthya_token');
      localStorage.removeItem('swasthya_user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Generic Login handler
  const login = async (role, credentials) => {
    const res = await authApi.login(role, credentials);
    if (res?.success && res?.data?.user) {
      const authToken = res.data.token;
      const authUser = res.data.user;

      if (authToken) {
        localStorage.setItem('swasthya_token', authToken);
        setToken(authToken);
      }
      localStorage.setItem('swasthya_user', JSON.stringify(authUser));
      setUser(authUser);
      return res;
    }
    throw new Error(res?.message || 'Login failed');
  };

  // Generic Register handler
  const register = async (role, data) => {
    const res = await authApi.register(role, data);
    if (res?.success && res?.data?.user) {
      const authToken = res.data.token;
      const authUser = res.data.user;

      if (authToken) {
        localStorage.setItem('swasthya_token', authToken);
        setToken(authToken);
      }
      localStorage.setItem('swasthya_user', JSON.stringify(authUser));
      setUser(authUser);
      return res;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  // Logout handler
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Logout API call error:', e);
    } finally {
      localStorage.removeItem('swasthya_token');
      localStorage.removeItem('swasthya_user');
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role?.toLowerCase() || '',
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
