import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UpgradePrompt = ({ isOpen, onClose, feature, remaining }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm pointer-events-auto"
            >
            <div className="glass-card p-5 relative max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <X size={18} />
              </button>

              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown size={24} className="text-white" />
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-center gradient-text mb-3">
                {remaining === 0 ? 'Limit Reached!' : 'Almost There!'}
              </h2>

              {/* Message */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                {remaining === 0 ? (
                  <>
                    You've used all your <strong>{feature}</strong> operations for today.
                    Upgrade to Premium for unlimited access!
                  </>
                ) : (
                  <>
                    You have <strong>{remaining}</strong> {feature} operations left today.
                    Upgrade to Premium for 100x more!
                  </>
                )}
              </p>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-3 mb-4">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <Zap size={16} className="text-primary-500" />
                  Premium Benefits:
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                    100x more operations per day
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                    Access to AI tools
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                    Batch processing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                    50MB file size limit
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                    Priority support
                  </li>
                </ul>
              </div>

              {/* Pricing */}
              <div className="text-center mb-4">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-3xl font-bold gradient-text">100% FREE</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Just login to activate!
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <Link
                  to="/pricing"
                  className="w-full bg-gradient-to-r from-primary-500 to-purple-500 text-white py-2.5 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Crown size={18} />
                  Activate Premium (Free)
                  <ArrowRight size={16} />
                </Link>
                <button
                  onClick={onClose}
                  className="w-full glass-button py-2.5 text-sm"
                >
                  Maybe Later
                </button>
              </div>

              {/* Note */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                ✨ 100% Free • No Payment Required
              </p>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpgradePrompt;

