import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { Event } from '../../types';
import EventCard from '../events/EventCard';
import { AlertCircle, Calendar, CheckCircle } from 'lucide-react';

const AttendeeDashboard: React.FC = () => {
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
      setLoading(true);
      const data = await userService.getRegisteredEvents();
      setRegisteredEvents(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load registered events.');
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = registeredEvents.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing');
  const pastEvents = registeredEvents.filter(e => e.status === 'Completed');

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

      {/* Simple stats banner */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="glass-panel p-5 rounded-xl border border-white/5 flex items-center space-x-4">
          <div class="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <Calendar className="h-6 w-6 text-primary-light" />
          </div>
          <div>
            <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Registered Upcoming</h4>
            <p class="text-2xl font-bold text-white mt-1">{upcomingEvents.length}</p>
          </div>
        </div>

        <div class="glass-panel p-5 rounded-xl border border-white/5 flex items-center space-x-4">
          <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
            <CheckCircle className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed Attended</h4>
            <p class="text-2xl font-bold text-white mt-1">{pastEvents.length}</p>
          </div>
        </div>
      </div>

      {/* Registered Events Section */}
      <div>
        <h3 class="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <span>Your Registrations</span>
          <span class="bg-white/5 border border-white/10 text-gray-400 text-xs px-2.5 py-0.5 rounded-full">
            {registeredEvents.length} Total
          </span>
        </h3>

        {registeredEvents.length === 0 ? (
          <div class="glass-panel text-center py-12 rounded-xl border border-white/5">
            <span class="text-3xl">🎫</span>
            <p class="text-sm text-gray-400 mt-3">You haven't registered for any events yet.</p>
            <a href="/" class="inline-block mt-4 text-xs font-semibold text-primary-light hover:text-white transition">
              Explore events and register &rarr;
            </a>
          </div>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeeDashboard;
