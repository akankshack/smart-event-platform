import api from './api';
import { Event } from '../types';

export const eventService = {
  // Create an event (uses FormData to support poster image upload)
  createEvent: async (formData: FormData): Promise<Event> => {
    const response = await api.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Get events created by the logged-in organizer
  getOrganizerEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events/my-events');
    return response.data.data;
  },

  // Update an event
  updateEvent: async (id: string, formData: FormData): Promise<Event> => {
    const response = await api.put(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Delete an event
  deleteEvent: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};
