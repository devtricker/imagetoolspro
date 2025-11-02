import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Home, Wrench, Info, Mail, User, LogOut, Shield, Inbox, DollarSign, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userPlan, setUserPlan] = useState('free');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isAdmin = user?.email === 'devtronex@gmail.com';

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Fetch user's plan
  useEffect(() => {
    if (!user) {
      setUserPlan('free');
      return;
    }

    const userRef = ref(database, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.plan) {
        setUserPlan(data.plan);
      } else {
        setUserPlan('free');
      }
    });

    return () => unsubscribe();
  }, [user]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Pricing', path: '/pricing', icon: DollarSign },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="glass-card sticky top-0 z-50 mb-8">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-4xl">🖼️</span>
            <span className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform">
              ImageToolsPro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(link.path)
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}

            {/* Inbox Link - Only for logged-in users */}
            {user && !isAdmin && (
              <Link
                to="/inbox"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isActive('/inbox')
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Inbox size={18} />
                <span className="font-medium">Inbox</span>
              </Link>
            )}

            {/* Admin Link */}
            {isAdmin && (
              <>
                <Link
                  to="/inbox"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/inbox')
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Inbox size={18} />
                  <span className="font-medium">Inbox</span>
                </Link>
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/admin')
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Shield size={18} />
                  <span className="font-medium">Admin</span>
                </Link>
              </>
            )}

            {/* User Menu / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
                >
                  <User size={18} />
                  <span className="font-medium">{user.displayName || user.email?.split('@')[0]}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 glass-card p-2 space-y-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      {/* Plan Badge */}
                      <div className="mt-2">
                        {userPlan === 'premium' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                            <Crown size={12} />
                            Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                            Free Plan
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-all"
              >
                <User size={18} />
                <span className="font-medium">Login</span>
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-2"
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                      isActive(link.path)
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Inbox Link */}
              {user && (
                <Link
                  to="/inbox"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                    isActive('/inbox')
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Inbox size={18} />
                  <span className="font-medium">Inbox</span>
                </Link>
              )}

              {/* Mobile Admin Link */}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                    isActive('/admin')
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Shield size={18} />
                  <span className="font-medium">Admin</span>
                </Link>
              )}

              {/* Mobile User Menu */}
              {user ? (
                <>
                  <div className="px-4 py-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {user.displayName || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    {/* Plan Badge */}
                    <div className="mt-2">
                      {userPlan === 'premium' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                          <Crown size={12} />
                          Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                          Free Plan
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all w-full"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-all"
                >
                  <User size={18} />
                  <span className="font-medium">Login</span>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;

