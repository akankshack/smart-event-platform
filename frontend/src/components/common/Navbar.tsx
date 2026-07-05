import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, LogOut, Menu, X, User as UserIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navLinks = [
    { name: 'Browse Events', path: '/' },
    ...(user ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-gradient font-extrabold text-2xl font-sans">SmartEvent</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth CTA & Profile Controls */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full py-1 px-3">
                <UserIcon className="h-4 w-4 text-primary" />
                <span className="text-xs text-gray-200 font-semibold">
                  {user.name} ({user.role})
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-all px-4 py-2 rounded-lg text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-lg hover:shadow-primary/20 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/5 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium py-1"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <div className="flex flex-col space-y-3 pt-2 border-t border-white/5">
              <div className="text-xs text-gray-400 font-semibold">
                Logged in as:{' '}
                <span className="text-gray-200">
                  {user.name} ({user.role})
                </span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg py-2 text-sm font-semibold transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-2 border-t border-white/5">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-gray-300 hover:text-white py-2 rounded-lg text-sm font-medium border border-white/5"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm py-2 rounded-lg shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;