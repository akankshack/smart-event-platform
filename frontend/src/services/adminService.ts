import api from './api';
import { User, DashboardStats } from '../types';

export const adminService = {
  // Get all users in the system
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data.data;
  },

  // Delete a user by ID
  deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get statistics for the dashboard (returns stats tailored to the requester's role)
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  }
};
