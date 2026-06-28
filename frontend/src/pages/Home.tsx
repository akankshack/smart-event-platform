import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { Event } from '../types';
import EventGrid from '../components/events/EventGrid';
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react';

const categories = ['All', 'Conference', 'Workshop', 'Seminar', 'Hackathon', 'Webinar', 'Meetup', 'Cultural', 'Sports'];
const statuses = ['All', 'Upcoming', 'Ongoing', 'Completed'];

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedStatus]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await userService.getEvents({
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus
      });
      setEvents(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch events list.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
      
      {/* Hero Banner */}
      <div class="relative rounded-3xl overflow-hidden glass-panel border border-white/5 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div class="space-y-4 max-w-xl">
          <span class="inline-flex items-center space-x-1.5 bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold px-3 py-1 rounded-full">
            <span>🚀 Placement-oriented Event hub</span>
          </span>
          <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover & Register for <span class="text-gradient">Tech Events</span>
          </h1>
          <p class="text-sm md:text-base text-gray-400">
            A secure event portal for developers, organizers, and campus students. Browse workshops, hackathons, and seminars.
          </p>
        </div>
        <div class="flex items-center justify-center bg-white/5 rounded-2xl w-24 h-24 sm:w-32 sm:h-32 border border-white/10 shrink-0">
          <span class="text-5xl sm:text-6xl animate-bounce">⚡</span>
        </div>
      </div>

      {error && (
        <div class="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters & Search section */}
      <div class="space-y-6">
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} class="flex-grow max-w-md relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by title or description..."
              class="w-full glass-input rounded-xl pl-11 pr-4 py-2.5 text-sm"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          </form>

          {/* Sliders indicator */}
          <div class="flex items-center space-x-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>Filter Options</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div class="space-y-3">
          {/* Categories */}
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs text-gray-400 mr-2">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                class={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status */}
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs text-gray-400 mr-2">Status:</span>
            {statuses.map((stat) => (
              <button
                key={stat}
                onClick={() => setSelectedStatus(stat)}
                class={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                  selectedStatus === stat
                    ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div class="flex items-center justify-center min-h-[300px]">
          <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <EventGrid events={events} />
      )}

    </div>
  );
};

export default Home;
