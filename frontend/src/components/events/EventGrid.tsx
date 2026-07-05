import React from 'react';
import { Event } from '../../types';
import EventCard from './EventCard';

interface EventGridProps {
  events: Event[];
  showOrganizerControls?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
}

const EventGrid: React.FC<EventGridProps> = ({
  events,
  showOrganizerControls = false,
  onEdit,
  onDelete,
}) => {
  if (events.length === 0) {
    return (
      <div className="glass-panel text-center py-16 px-4 rounded-2xl border border-white/5 max-w-lg mx-auto mt-8">
        <span className="text-4xl">📅</span>
        <h4 className="text-lg font-bold text-white mt-4">No events found</h4>
        <p className="text-sm text-gray-400 mt-2">
          There are no events matching your criteria at this time. Check back later or adjust your
          filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          showOrganizerControls={showOrganizerControls}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default EventGrid;