import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../../types';
import { MapPin, Calendar as CalendarIcon, Users } from 'lucide-react';

interface EventCardProps {
  event: Event;
  showOrganizerControls?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  showOrganizerControls = false,
  onEdit,
  onDelete
}) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Ongoing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Completed':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getDefaultImage = (category: string) => {
    switch (category) {
      case 'Hackathon':
        return '/images/hackathon.jpeg';
      case 'Conference':
        return '/images/conference.jpeg';
      case 'Workshop':
        return '/images/workshop.jpeg';
      case 'Seminar':
        return '/images/seminar.jpeg';
      case 'Webinar':
        return '/images/webinar.jpeg';
      case 'Meetup':
        return '/images/meetup.jpeg';
      case 'Cultural':
        return '/images/cultural.jpeg';
      case 'Sports':
        return '/images/sports.jpeg';
      default:
        return '/images/conference.jpeg';
    }
  };

  return (
    <div className="glass-card overflow-hidden rounded-xl flex flex-col h-full">
      {/* Poster Image */}
      <div className="relative h-48 w-full overflow-hidden bg-white/5">
        <img
          src={event.posterImage || getDefaultImage(event.category)}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = getDefaultImage(event.category);
          }}
        />

        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-primary/20 backdrop-blur-md text-primary-light text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/30">
          {event.category}
        </span>

        {/* Status Tag */}
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(event.status)}`}
        >
          {event.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 hover:text-primary transition-colors">
          <Link to={`/events/${event._id}`}>{event.title}</Link>
        </h3>

        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mt-auto text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-primary-light" />
            <span>{formattedDate} • {event.time}</span>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-primary-light" />
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-primary-light" />
            <span>
              {event.registrationCount !== undefined
                ? `${event.registrationCount} Registered`
                : `Capacity: ${event.capacity}`}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          {showOrganizerControls ? (
            <div className="flex items-center space-x-2 w-full">
              <button
                onClick={() => onEdit && onEdit(event)}
                className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg py-1.5 text-xs font-semibold transition"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete && onDelete(event._id)}
                className="flex-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg py-1.5 text-xs font-semibold transition"
              >
                Delete
              </button>
            </div>
          ) : (
            <Link
              to={`/events/${event._id}`}
              className="w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg py-2 text-xs font-semibold transition"
            >
              View Details →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;