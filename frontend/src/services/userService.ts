import api from './api';
import { Event } from '../types';

export interface EventFilterOptions {
  search?: string;
  category?: string;
  status?: string;
}

export const userService = {
  // Fetch events based on search keyword, category, and status filters
  getEvents: async (filters: EventFilterOptions): Promise<Event[]> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);

    const response = await api.get(`/users/events?${params.toString()}`);
    return response.data.data;
  },

  // Get details of a single event (including registered count and available slots)
  getEventById: async (id: string): Promise<Event> => {
    const response = await api.get(`/users/events/${id}`);
    return response.data.data;
  },

  // Register for an event
  registerForEvent: async (eventId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/users/events/${eventId}/register`);
    return response.data;
  },

  // Cancel registration for an event
  cancelRegistration: async (eventId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/users/events/${eventId}/register`);
    return response.data;
  },

  // Get events that the user is registered for
  getRegisteredEvents: async (): Promise<Event[]> => {
    const response = await api.get('/users/my-registrations');
    return response.data.data;
  }
};
