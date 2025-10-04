import axios from 'axios';
import { Notification, NotificationResponse, UnreadCountResponse } from '../interfaces/notification';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const notificationService = {
  getMyNotifications: async (params?: {
    page?: number;
    pageSize?: number;
    isRead?: boolean;
  }): Promise<NotificationResponse> => {
    const query = new URLSearchParams();
    
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));
    if (params?.isRead !== undefined) query.set('isRead', String(params.isRead));
    
    const url = `${API_URL}/notifications/my-notifications?${query.toString()}`;
    const response = await axios.get(url, {
      headers: getAuthHeaders(),
    });
    
    return response.data;
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await axios.get(`${API_URL}/notifications/unread-count`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  markAsRead: async (id: string): Promise<{ data: Notification }> => {
    const response = await axios.patch(`${API_URL}/notifications/${id}/mark-read`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  markAllAsRead: async (userId: string): Promise<{ message: string }> => {
    const response = await axios.patch(`${API_URL}/notifications/user/${userId}/mark-all-read`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  deleteNotification: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_URL}/notifications/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  deleteMany: async (ids: string[]): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_URL}/notifications`, {
      headers: getAuthHeaders(),
      data: { ids },
    });
    return response.data;
  },
};
