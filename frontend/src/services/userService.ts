import api from './api';
import { Event } from '../types';

export interface EventFilterOptions {
  search?: string;
  category?: string;
  status?: string;
}

export const userService = {
  // Fetch all public events
  getEvents: async (filters: EventFilterOptions = {}): Promise<Event[]> => {
    const params = new URLSearchParams();

    if (filters.search && filters.search !== '') params.append('search', filters.search);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);

    const queryString = params.toString();
    const url = queryString ? `/events?${queryString}` : '/events';

    const response = await api.get(url);
    return response.data.data;
  },

  // Get details of one event
  getEventById: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
  },

  // Register for an event
  registerForEvent: async (
    eventId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  },

  // Cancel registration
  cancelRegistration: async (
    eventId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/events/${eventId}/register`);
    return response.data;
  },

  // Get logged-in user's registered events
  getRegisteredEvents: async (): Promise<Event[]> => {
    const response = await api.get('/users/my-registrations');
    return response.data.data;
  }
};