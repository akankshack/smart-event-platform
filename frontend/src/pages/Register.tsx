import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, AlertCircle } from 'lucide-react';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Attendee' | 'Organizer' | 'Admin'>('Attendee');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await register({ name, email, password, role });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="flex items-center justify-center min-h-[85vh] px-4 py-8">
      <div class="glass-panel w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
        
        {/* Header */}
        <div class="text-center space-y-2">
          <div class="inline-flex items-center justify-center bg-primary/10 border border-primary/20 rounded-xl p-3 mb-2">
            <Calendar className="h-6 w-6 text-primary-light" />
          </div>
          <h2 class="text-2xl font-extrabold text-white">Create Account</h2>
          <p class="text-xs text-gray-400">Join the SmartEvent platform as Attendee, Organizer, or Admin</p>
        </div>

        {error && (
          <div class="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              class="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              class="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              class="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
              minLength={6}
              required
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account Role</label>
            <div class="grid grid-cols-3 gap-2">
              {(['Attendee', 'Organizer', 'Admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  class={`py-2 text-xs font-semibold rounded-lg border transition ${
                    role === r
                      ? 'bg-primary/20 border-primary text-primary-light'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-semibold text-sm py-2.5 rounded-lg shadow-lg hover:shadow-primary/20 transition-all duration-200 mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Footer */}
        <div class="text-center text-xs text-gray-400 pt-2">
          <span>Already have an account? </span>
          <Link to="/login" class="text-primary-light hover:text-white font-bold transition">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
