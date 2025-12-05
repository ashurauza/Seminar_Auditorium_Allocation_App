import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/helpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = storage.get('token');
    
    if (token) {
      const result = authService.verifyToken(token);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        storage.set('user', result.user);
      } else {
        // Token expired or invalid
        logout();
      }
    }
    
    setLoading(false);
  };

  const login = async (email, password, rememberMe = false) => {
    const result = await authService.login(email, password, rememberMe);
    
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      storage.set('token', result.token);
      storage.set('user', result.user);
    }
    
    return result;
  };

  const register = async (userData) => {
    const result = await authService.register(userData);
    
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      storage.set('token', result.token);
      storage.set('user', result.user);
    }
    
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = async (updates) => {
    if (!user) return { success: false, message: 'Not authenticated' };
    
    const result = await authService.updateProfile(user.id, updates);
    
    if (result.success) {
      setUser(result.user);
      storage.set('user', result.user);
    }
    
    return result;
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (!user) return { success: false, message: 'Not authenticated' };
    
    return await authService.changePassword(user.id, oldPassword, newPassword);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile,
    changePassword,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
