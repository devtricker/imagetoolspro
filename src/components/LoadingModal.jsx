import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingModal = ({ isOpen, message = 'Processing...' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-8 max-w-sm w-full mx-4"
          >
            <div className="flex flex-col items-center space-y-4">
              <Loader2 size={48} className="text-primary-600 dark:text-primary-400 animate-spin" />
              <h3 className="text-xl font-semibold">{message}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Please wait while we process your image...
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingModal;

