import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Notification } from '../interfaces/notification';
import { User } from '../interfaces/user';
import { notificationService } from '../services/notification';
import { addLoginCallback, removeLoginCallback } from './auth';
import { useGetIdentity } from '@refinedev/core';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  filter: 'all' | 'unread';
  setFilter: (filter: 'all' | 'unread') => void;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  loadNotificationsOnDemand: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const loginCallbackRef = useRef<(() => void) | null>(null);
  
  const { data: user } = useGetIdentity<User>();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {
        pageSize: 30,
        ...(filter === 'unread' && { isRead: false })
      };
      
      const response = await notificationService.getMyNotifications(params);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const notificationToDelete = notifications.find(n => n._id === id);
      
      await notificationService.deleteNotification(id);
      
      setNotifications(prev => prev.filter(notification => notification._id !== id));
      
      if (notificationToDelete && !notificationToDelete.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const refreshNotifications = async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  };

  const loadNotificationsOnDemand = async () => {
    await fetchNotifications();
  };

  const clearNotificationData = () => {
    setNotifications([]);
    setUnreadCount(0);
    setLoading(false);
    setFilter('all');
    setCurrentUserId(null);
  };

  const resetNotificationState = () => {
    setNotifications([]);
    setUnreadCount(0);
    setLoading(false);
    setFilter('all');
  };

  useEffect(() => {
    const userId = user?._id;
    
    if (userId && userId !== currentUserId) {
      resetNotificationState();
      setCurrentUserId(userId);
      
      fetchUnreadCount();
    } else if (!userId && currentUserId) {
      resetNotificationState();
      setCurrentUserId(null);
    }
  }, [user, currentUserId]);

  useEffect(() => {
    const loginCallback = () => {
      resetNotificationState();
      fetchUnreadCount();
    };

    loginCallbackRef.current = loginCallback;
    addLoginCallback(loginCallback);

    return () => {
      if (loginCallbackRef.current) {
        removeLoginCallback(loginCallbackRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      clearNotificationData();
    };
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchUnreadCount();

      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 20000);

      return () => clearInterval(interval);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (notifications.length > 0) {
      fetchNotifications();
    }
  }, [filter]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    filter,
    setFilter,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    deleteNotification,
    refreshNotifications,
    loadNotificationsOnDemand,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
