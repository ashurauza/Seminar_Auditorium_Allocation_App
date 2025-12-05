import { useState, useEffect } from 'react';
import { storage } from '../utils/helpers';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = storage.get('token');
    const userData = storage.get('user');
    
    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  };

  const login = (userData, token) => {
    storage.set('token', token);
    storage.set('user', userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    storage.remove('token');
    storage.remove('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
};
