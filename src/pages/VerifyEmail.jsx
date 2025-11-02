import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const { user, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // If user is verified, redirect to home
    if (user?.emailVerified) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      setError('');
      await resendVerification();
      setMessage('Verification email sent! Please check your inbox and spam folder.');
    } catch (error) {
      setError('Failed to send verification email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="glass-card p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={40} className="text-primary-500" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold gradient-text mb-4">
            Verify Your Email
          </h1>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We've sent a verification link to:
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-8">
            {user?.email}
          </p>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Next Steps:
            </h3>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Click the verification link in the email</li>
              <li>Return here and click "I've Verified"</li>
            </ol>
          </div>

          {/* Success Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg flex items-center space-x-2"
            >
              <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-center space-x-2"
            >
              <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCheckVerification}
              className="w-full bg-gradient-to-r from-primary-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
            >
              I've Verified My Email
            </button>

            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="w-full glass-button py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                <span>{loading ? 'Sending...' : 'Resend Verification Email'}</span>
              </div>
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
            Didn't receive the email? Check your spam folder or click resend.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
