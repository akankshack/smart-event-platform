import React, { useState, useEffect } from 'react';
import { Event } from '../../types';
import { Upload, X, AlertCircle } from 'lucide-react';

interface EventFormProps {
  initialData?: Event | null;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const categories = [
  'Conference',
  'Workshop',
  'Seminar',
  'Hackathon',
  'Webinar',
  'Meetup',
  'Cultural',
  'Sports',
];

const statuses = ['Upcoming', 'Ongoing', 'Completed'];

const EventForm: React.FC<EventFormProps> = ({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState('10');
  const [status, setStatus] = useState('Upcoming');
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || categories[0]);

      const dateObj = new Date(initialData.date);
      const formattedDate = !isNaN(dateObj.getTime())
        ? dateObj.toISOString().split('T')[0]
        : '';
      setDate(formattedDate);

      setTime(initialData.time || '');
      setVenue(initialData.venue || '');
      setCapacity(String(initialData.capacity ?? 10));
      setStatus(initialData.status || 'Upcoming');
      setPosterPreview(initialData.posterImage || '');
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category || !date || !time || !venue || !capacity) {
      setError('Please fill in all required fields');
      return;
    }

    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('category', category);
    data.append('date', date);
    data.append('time', time);
    data.append('venue', venue);
    data.append('capacity', capacity);
    data.append('status', status);

    if (posterFile) {
      data.append('poster', posterFile);
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., National Level Coding Hackathon"
              className="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write event overview, schedule, rules..."
              rows={4}
              className="w-full glass-input rounded-lg px-4 py-2.5 text-sm resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#111827] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#111827] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Time *
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 10:00 AM - 4:00 PM"
                className="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Venue *
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Seminar Hall 1 / Google Maps link"
                className="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Capacity *
              </label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Event Poster
            </label>

            {posterPreview ? (
              <div className="relative rounded-lg overflow-hidden border border-white/10 h-32 bg-white/5">
                <img
                  src={posterPreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPosterFile(null);
                    setPosterPreview('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-primary/40 rounded-lg p-6 bg-white/5 cursor-pointer hover:bg-white/10 transition group">
                <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary-light transition" />
                <span className="text-xs text-gray-400 group-hover:text-white transition mt-2">
                  Upload Poster (Max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-sm px-4 py-2 rounded-lg transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark disabled:opacity-50 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-lg hover:shadow-primary/20 transition-all duration-200"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;