import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { User, DashboardStats } from '../../types';
import { Users, Calendar, Ticket, UserX, AlertCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersList, statsData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getStats(),
      ]);
      setUsers(usersList);
      setStats(statsData);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load system admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${name}"? This will remove all their registrations, and if they are an Organizer, delete all their created events.`
      )
    ) {
      return;
    }

    try {
      await adminService.deleteUser(id);
      fetchAdminData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Simple Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center space-x-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <Users className="h-6 w-6 text-primary-light" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Users
            </h4>
            <p className="text-2xl font-bold text-white mt-1">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center space-x-4">
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
            <Calendar className="h-6 w-6 text-secondary-light" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Events
            </h4>
            <p className="text-2xl font-bold text-white mt-1">{stats?.totalEvents || 0}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center space-x-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <Ticket className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Registrations
            </h4>
            <p className="text-2xl font-bold text-white mt-1">
              {stats?.totalRegistrations || 0}
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center space-x-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
            <Calendar className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Upcoming Events
            </h4>
            <p className="text-2xl font-bold text-white mt-1">{stats?.upcomingEvents || 0}</p>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6">User Accounts</h3>

        <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-200">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{u.name}</td>
                    <td className="p-4 text-gray-400">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                          u.role === 'Admin'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : u.role === 'Organizer'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg p-1.5 inline-flex items-center space-x-1.5 text-xs transition duration-200"
                        title="Delete User"
                      >
                        <UserX className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;