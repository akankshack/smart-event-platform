import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="flex items-center justify-center min-h-[80vh] px-4">
      <div class="glass-panel w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
        
        {/* Header */}
        <div class="text-center space-y-2">
          <div class="inline-flex items-center justify-center bg-primary/10 border border-primary/20 rounded-xl p-3 mb-2">
            <Calendar className="h-6 w-6 text-primary-light" />
          </div>
          <h2 class="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p class="text-xs text-gray-400">Sign in to manage your registrations or events</p>
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
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              class="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
              required
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" class="text-xs text-primary-light hover:text-white transition">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              class="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-semibold text-sm py-2.5 rounded-lg shadow-lg hover:shadow-primary/20 transition-all duration-200"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div class="text-center text-xs text-gray-400 pt-2">
          <span>Don't have an account? </span>
          <Link to="/register" class="text-primary-light hover:text-white font-bold transition">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
