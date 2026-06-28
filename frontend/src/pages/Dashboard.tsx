import React from 'react';
import { useAuth } from '../context/AuthContext';
import AttendeeDashboard from '../components/dashboard/AttendeeDashboard';
import OrganizerDashboard from '../components/dashboard/OrganizerDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import { Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const renderDashboard = () => {
    switch (user.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Organizer':
        return <OrganizerDashboard />;
      case 'Attendee':
        return <AttendeeDashboard />;
      default:
        return <AttendeeDashboard />;
    }
  };

  return (
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header and User Details */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div class="space-y-1">
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span>SmartEvent Dashboard</span>
          </h1>
          <p class="text-xs md:text-sm text-gray-400">
            Welcome back, <span class="font-semibold text-white">{user.name}</span>. You are logged in as <span class="text-primary-light font-medium">{user.role}</span>.
          </p>
        </div>
      </div>

      {/* Embedded Dashboard component */}
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
