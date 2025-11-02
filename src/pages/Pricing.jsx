import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  Crown, 
  Zap, 
  Shield,
  Star,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PLANS, RAZORPAY_CONFIG } from '../config/plans';
import { ref, update, onValue } from 'firebase/database';
import { database } from '../firebase/config';
import SuccessPopup from '../components/SuccessPopup';
import { BannerAd } from '../components/ads';

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userPlan, setUserPlan] = useState('free');
  const [planExpiryDate, setPlanExpiryDate] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch user's current plan
  useEffect(() => {
    if (!user) {
      setUserPlan('free');
      setPlanExpiryDate(null);
      return;
    }

    const userRef = ref(database, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.plan) {
        setUserPlan(data.plan);
        setPlanExpiryDate(data.planExpiryDate || null);
      } else {
        setUserPlan('free');
        setPlanExpiryDate(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Directly activate premium (no payment required)
      const userRef = ref(database, `users/${user.uid}`);
      
      // First check if user data exists
      const { get } = await import('firebase/database');
      const snapshot = await get(userRef);
      
      // Calculate expiry date (1 month from now)
      const startDate = Date.now();
      const expiryDate = startDate + (30 * 24 * 60 * 60 * 1000); // 30 days
      
      const userData = {
        plan: 'premium',
        planStartDate: startDate,
        planExpiryDate: expiryDate,
        updatedAt: Date.now(),
        email: user.email,
        displayName: user.displayName || ''
      };

      // If user doesn't exist, create with all data
      if (!snapshot.exists()) {
        userData.createdAt = Date.now();
      }

      await update(userRef, userData);

      // Show success message
      setError('');
      setLoading(false);
      setShowSuccess(true);
      
      // Auto close after 10 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 10000);
    } catch (error) {
      console.error('Error activating premium:', error);
      setError('Failed to activate premium. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold gradient-text mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Start with free plan or activate premium for 100x more features - completely free!
        </p>
      </motion.div>

      {/* Banner Ad */}
      <BannerAd />

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto mb-8 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 relative"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {PLANS.FREE.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Perfect for trying out
              </p>
            </div>
            <Zap className="text-gray-400" size={40} />
          </div>

          <div className="mb-6">
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">
                ${PLANS.FREE.price}
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                / forever
              </span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {PLANS.FREE.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </li>
            ))}
            <li className="flex items-start gap-3">
              <X className="text-red-500 flex-shrink-0 mt-1" size={20} />
              <span className="text-gray-500 line-through">AI Tools</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="text-red-500 flex-shrink-0 mt-1" size={20} />
              <span className="text-gray-500 line-through">Batch Processing</span>
            </li>
          </ul>

          <button
            onClick={() => !user && navigate('/signup')}
            disabled={user && userPlan === 'free'}
            className={`w-full glass-button py-3 ${
              user && userPlan === 'free' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {user && userPlan === 'free' ? '✓ Current Plan' : 'Sign Up to Start'}
          </button>

          {!user && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              ⚠️ Login required to use any tools
            </p>
          )}
          
          {user && userPlan === 'free' && (
            <p className="text-center text-sm text-green-600 dark:text-green-400 mt-4 font-semibold">
              ✓ You are on Free Plan
            </p>
          )}
        </motion.div>

        {/* Premium Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 relative border-2 border-primary-500 shadow-2xl"
        >
          {/* Popular Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-primary-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 shadow-lg">
              <Star size={16} fill="currentColor" />
              Most Popular
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 mt-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {PLANS.PREMIUM.name}
                <Crown className="text-yellow-500" size={24} />
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                For power users
              </p>
            </div>
            <Shield className="text-primary-500" size={40} />
          </div>

          <div className="mb-6">
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-bold gradient-text">
                FREE
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                / forever
              </span>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              1 Month Free Trial - Just login to activate!
            </p>
          </div>

          <ul className="space-y-3 mb-8">
            {PLANS.PREMIUM.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={loading || !user || userPlan === 'premium'}
            className="w-full bg-gradient-to-r from-primary-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : userPlan === 'premium' ? (
              <>
                <Crown size={20} />
                ✓ Current Plan
              </>
            ) : (
              <>
                <Crown size={20} />
                {user ? 'Activate Premium' : 'Login to Activate'}
              </>
            )}
          </button>

          {!user && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Please login to activate premium
            </p>
          )}
          
          {user && userPlan === 'premium' && (
            <div className="text-center mt-4">
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                🎉 You are on Premium Plan!
              </p>
              {planExpiryDate && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Valid until: {new Date(planExpiryDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
            </div>
          )}

          {/* Free Trial Badge */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-300 text-center font-medium">
              ✨ Free for 1 Month • No Payment Required • Instant Activation
            </p>
          </div>
        </motion.div>
      </div>

      {/* Features Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16 max-w-5xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center gradient-text mb-8">
          Feature Comparison
        </h2>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-900 dark:text-gray-100 font-semibold">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-gray-900 dark:text-gray-100 font-semibold">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-gray-900 dark:text-gray-100 font-semibold">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Conversions/day</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">5</td>
                  <td className="px-6 py-4 text-center text-primary-500 font-semibold">100</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Resize/day</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">5</td>
                  <td className="px-6 py-4 text-center text-primary-500 font-semibold">100</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Compress/day</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">5</td>
                  <td className="px-6 py-4 text-center text-primary-500 font-semibold">100</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Edit/day</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">3</td>
                  <td className="px-6 py-4 text-center text-primary-500 font-semibold">50</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">AI Tools/day</td>
                  <td className="px-6 py-4 text-center">
                    <X className="text-red-500 mx-auto" size={20} />
                  </td>
                  <td className="px-6 py-4 text-center text-primary-500 font-semibold">20</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Batch Processing</td>
                  <td className="px-6 py-4 text-center">
                    <X className="text-red-500 mx-auto" size={20} />
                  </td>
                  <td className="px-6 py-4 text-center text-primary-500 font-semibold">50/day</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Max File Size</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">5 MB</td>
                  <td className="px-6 py-4 text-center text-primary-500 font-semibold">50 MB</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Priority Support</td>
                  <td className="px-6 py-4 text-center">
                    <X className="text-red-500 mx-auto" size={20} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="text-green-500 mx-auto" size={20} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 max-w-3xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center gradient-text mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
              Can I use the free plan without logging in?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No, you need to create a free account to use any features. This helps us track your usage limits.
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
              How do daily limits work?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your usage resets every 24 hours. For example, if you use 5 conversions today, you'll get 5 more tomorrow.
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
              Is premium really free?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yes! Premium is 100% free. Just login and click "Activate Premium" to get instant access to all features.
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
              How do I activate premium?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Simply login to your account, go to the pricing page, and click "Activate Premium". It's instant and free!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="🎉 Premium activated! You now have access to all premium features!"
      />
    </div>
  );
};

export default Pricing;

