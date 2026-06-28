import React, { useEffect, useState } from 'react';
import { eventService } from '../../services/eventService';
import { adminService } from '../../services/adminService';
import { Event, DashboardStats } from '../../types';
import EventCard from '../events/EventCard';
import EventForm from '../events/EventForm';
import { Calendar, BarChart3, Plus, X, AlertCircle } from 'lucide-react';

const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form modal triggers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [eventsList, statsData] = await Promise.all([
        eventService.getOrganizerEvents(),
        adminService.getStats()
      ]);
      setEvents(eventsList);
      setStats(statsData);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard records');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTrigger = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event? This will permanently cancel all user registrations.')) {
      return;
    }
    try {
      await eventService.deleteEvent(id);
      fetchDashboardData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setFormLoading(true);
      if (editingEvent) {
        await eventService.updateEvent(editingEvent._id, formData);
      } else {
        await eventService.createEvent(formData);
      }
      setIsFormOpen(false);
      setEditingEvent(null);
      fetchDashboardData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process event submission');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  if (loading) {
    return (
      <div class="flex items-center justify-center min-h-[300px]">
        <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div class="space-y-8">
      {error && (
        <div class="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Simple Stats Grid */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="glass-panel p-5 rounded-xl border border-white/5 flex items-center space-x-4">
          <div class="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <Calendar className="h-6 w-6 text-primary-light" />
          </div>
          <div>
            <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Events Created</h4>
            <p class="text-2xl font-bold text-white mt-1">{stats?.myEventsCount || 0}</p>
          </div>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-white/5 flex items-center space-x-4">
          <div class="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
            <BarChart3 className="h-6 w-6 text-secondary-light" />
          </div>
          <div>
            <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Registrations</h4>
            <p class="text-2xl font-bold text-white mt-1">{stats?.myRegistrationsCount || 0}</p>
          </div>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-white/5 flex items-center space-x-4">
          <div class="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <Calendar className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Upcoming Events</h4>
            <p class="text-2xl font-bold text-white mt-1">{stats?.myUpcomingEventsCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Controls & Event Management */}
      <div>
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-white flex items-center space-x-2">
            <span>Manage Your Events</span>
            <span class="bg-white/5 border border-white/10 text-gray-400 text-xs px-2.5 py-0.5 rounded-full">
              {events.length} Created
            </span>
          </h3>
          
          <button
            onClick={() => {
              setEditingEvent(null);
              setIsFormOpen(true);
            }}
            class="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-lg hover:shadow-primary/20 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </button>
        </div>

        {events.length === 0 ? (
          <div class="glass-panel text-center py-16 rounded-xl border border-white/5">
            <span class="text-4xl">🎟️</span>
            <h4 class="text-md font-bold text-white mt-4">Create your first event</h4>
            <p class="text-xs text-gray-400 mt-2 max-w-xs mx-auto">
              Get started by clicking the "Create Event" button above. Add details, set capacity limit, and upload a poster.
            </p>
          </div>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                showOrganizerControls={true}
                onEdit={handleEditTrigger}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal overlay */}
      {isFormOpen && (
        <div class="fixed inset-0 z-50 bg-[#090d16]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div class="glass-panel rounded-2xl border border-white/10 w-full max-w-4xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={handleFormCancel}
              class="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 class="text-xl font-bold text-white mb-6">
              {editingEvent ? `Edit Event: ${editingEvent.title}` : 'Create New Event'}
            </h3>
            <EventForm
              initialData={editingEvent}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={formLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
