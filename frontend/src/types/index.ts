export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Organizer' | 'Attendee';
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  _id: string;
  organizer: {
    _id: string;
    name: string;
    email: string;
  } | string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  posterImage: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  registeredCount?: number;
  availableSlots?: number;
  registrationCount?: number; // Aggregated for Organizer view
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalEvents: number;
  totalRegistrations: number;
  upcomingEvents: number;
  totalUsers?: number; // Admin only
  myEventsCount?: number; // Organizer only
  myRegistrationsCount?: number; // Organizer only
  myUpcomingEventsCount?: number; // Organizer only
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data?: T;
}
