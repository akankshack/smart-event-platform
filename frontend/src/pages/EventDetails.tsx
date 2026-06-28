import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { Event } from '../types';
import { MapPin, Calendar as CalendarIcon, Users, User, ArrowLeft, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id, user]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError('');
      if (!id) return;

      const eventData = await userService.getEventById(id);
      setEvent(eventData);

      // Check if logged-in user is already registered
      if (user) {
        const registrations = await userService.getRegisteredEvents();
        const found = registrations.some((regEvent) => regEvent._id === id);
        setIsRegistered(found);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      if (!event) return;

      await userService.registerForEvent(event._id);
      setIsRegistered(true);
      setSuccess('Successfully registered for this event! Check your dashboard for schedules.');
      // Refresh event details to update registration counts
      const updated = await userService.getEventById(event._id);
      setEvent(updated);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete registration.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      if (!event) return;

      await userService.cancelRegistration(event._id);
      setIsRegistered(false);
      setSuccess('Your registration has been cancelled.');
      // Refresh details
      const updated = await userService.getEventById(event._id);
      setEvent(updated);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel registration.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div class="max-w-md mx-auto text-center py-16 px-4">
        <span class="text-4xl">⚠️</span>
        <h3 class="text-xl font-bold text-white mt-4 font-sans">Event not found</h3>
        <Link to="/" class="inline-flex items-center space-x-2 text-primary-light hover:text-white mt-4 font-semibold text-sm">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to browse</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`;

  return (
    <div class="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
      
      {/* Back button */}
      <Link to="/" class="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition text-sm">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to events</span>
      </Link>

      {error && (
        <div class="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div class="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Image & Description */}
        <div class="lg:col-span-2 space-y-6">
          <div class="relative rounded-2xl overflow-hidden border border-white/5 h-64 md:h-96 bg-white/5">
            <img 
              src={event.posterImage || getDefaultImage(event.category)}
              alt={event.title} 
              class="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600';
              }}
            />
            <span class="absolute top-4 left-4 bg-primary/20 backdrop-blur-md text-primary-light text-xs font-semibold px-3 py-1 rounded-full border border-primary/30">
              {event.category}
            </span>
          </div>

          <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h1 class="text-2xl md:text-3xl font-extrabold text-white">{event.title}</h1>
            <div class="border-t border-white/5 pt-4">
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Event Overview</h3>
              <p class="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Metadata, Organizer info, Action CTA */}
        <div class="space-y-6">
          
          {/* Metadata Card */}
          <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Event Details</h3>

            <div class="space-y-4 text-sm text-gray-300">
              <div class="flex items-start space-x-3">
                <CalendarIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-white">Date & Time</p>
                  <p class="text-xs text-gray-400 mt-0.5">{formattedDate}</p>
                  <p class="text-xs text-gray-400">{event.time}</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-white">Venue Location</p>
                  <p class="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{event.venue}</p>
                  <a 
                    href={mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="inline-flex items-center space-x-1 text-xs text-primary-light hover:text-white transition font-medium mt-1"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-white">Event Capacity</p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    {event.registeredCount} / {event.capacity} slots filled
                  </p>
                  <p class="text-xs text-gray-500 font-medium">
                    {event.availableSlots} slots available
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-3 border-t border-white/5 pt-4">
                <User className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p class="font-semibold text-white">Organized By</p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    {typeof event.organizer === 'object' ? event.organizer.name : 'Organizer'}
                  </p>
                  <p class="text-[11px] text-gray-500">
                    {typeof event.organizer === 'object' ? event.organizer.email : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div class="pt-4 border-t border-white/5">
              {event.status === 'Completed' ? (
                <div class="bg-white/5 border border-white/10 text-center py-2.5 rounded-xl text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Event Finished
                </div>
              ) : isRegistered ? (
                <button
                  onClick={handleCancelRegistration}
                  disabled={actionLoading}
                  class="w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-sm font-semibold py-2.5 rounded-xl transition duration-200"
                >
                  {actionLoading ? 'Processing...' : 'Cancel Registration'}
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={actionLoading || (event.availableSlots !== undefined && event.availableSlots <= 0)}
                  class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark disabled:opacity-50 text-white text-sm font-bold py-3 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-200"
                >
                  {actionLoading 
                    ? 'Processing...' 
                    : !user 
                    ? 'Login to Register' 
                    : (event.availableSlots !== undefined && event.availableSlots <= 0)
                    ? 'Event Full'
                    : 'Register for Event'}
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default EventDetails;
