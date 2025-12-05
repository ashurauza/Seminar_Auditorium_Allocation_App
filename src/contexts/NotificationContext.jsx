import { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = () => {
    if (!user) return;
    
    const userNotifications = notificationService.getUserNotifications(user.id);
    setNotifications(userNotifications);
    setUnreadCount(notificationService.getUnreadCount(user.id));
  };

  const markAsRead = (notificationId) => {
    const result = notificationService.markAsRead(notificationId);
    if (result.success) {
      loadNotifications();
    }
    return result;
  };

  const markAllAsRead = () => {
    if (!user) return;
    
    const result = notificationService.markAllAsRead(user.id);
    if (result.success) {
      loadNotifications();
    }
    return result;
  };

  const deleteNotification = (notificationId) => {
    const result = notificationService.deleteNotification(notificationId);
    if (result.success) {
      loadNotifications();
    }
    return result;
  };

  const clearAll = () => {
    if (!user) return;
    
    const result = notificationService.clearAllNotifications(user.id);
    if (result.success) {
      loadNotifications();
    }
    return result;
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refresh: loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
