import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Calendar, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [devLink, setDevLink] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setMessage('');

      const response = await authService.forgotPassword(email);
      setMessage(response.message);

      if (response.devMockLink) {
        setDevLink(response.devMockLink);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center bg-primary/10 border border-primary/20 rounded-xl p-3 mb-2">
            <Calendar className="h-6 w-6 text-primary-light" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
          <p className="text-xs text-gray-400">
            Enter your email and we'll send a password reset link
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{message}</span>
            </div>

            {devLink && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-4 rounded-lg text-xs space-y-2">
                <p className="font-bold">🛠️ Sandbox Developer Notice:</p>
                <p>Since email server hooks are simulated, click the reset link below to proceed:</p>
                <a
                  href={devLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-light underline break-all font-semibold block hover:text-white"
                >
                  {devLink}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full glass-input rounded-lg px-4 py-2.5 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-semibold text-sm py-2.5 rounded-lg shadow-lg hover:shadow-primary/20 transition-all duration-200"
            >
              {isLoading ? 'Sending Link...' : 'Send Password Reset Link'}
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;