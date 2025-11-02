import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, LogIn, UserPlus } from 'lucide-react';

const LoginRequired = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="glass-card p-8 text-center">
          {/* Lock Icon */}
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-red-500" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Login Required
          </h1>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You need to login to use this tool. Please sign up or login to continue.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full bg-gradient-to-r from-primary-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Login to Continue
            </Link>

            <Link
              to="/signup"
              className="w-full glass-button py-3 flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Create New Account
            </Link>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              ✨ Sign up for free and get 5 operations per day!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginRequired;

