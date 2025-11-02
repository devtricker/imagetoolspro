import { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, update, get } from 'firebase/database';
import { database } from '../firebase/config';
import { useAuth } from './AuthContext';
import { PLANS } from '../config/plans';

const UsageContext = createContext({
  usage: {},
  userPlan: 'free',
  canUseFeature: () => false,
  incrementUsage: () => {},
  loading: true
});

export const useUsage = () => {
  const context = useContext(UsageContext);
  if (!context) {
    throw new Error('useUsage must be used within UsageProvider');
  }
  return context;
};

export const UsageProvider = ({ children }) => {
  const { user } = useAuth();
  const [usage, setUsage] = useState({});
  const [userPlan, setUserPlan] = useState('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Listen to user data for plan info
    const userRef = ref(database, `users/${user.uid}`);
    const unsubscribeUser = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Check if premium plan has expired
        if (data.plan === 'premium' && data.planExpiryDate) {
          const now = Date.now();
          if (now > data.planExpiryDate) {
            // Plan expired, downgrade to free
            update(userRef, {
              plan: 'free',
              previousPlan: 'premium',
              planExpiredAt: now,
              updatedAt: now
            });
            setUserPlan('free');
          } else {
            setUserPlan(data.plan);
          }
        } else {
          setUserPlan(data.plan || 'free');
        }
      } else {
        // Initialize user data if doesn't exist
        update(userRef, {
          plan: 'free',
          createdAt: Date.now(),
          email: user.email,
          displayName: user.displayName || ''
        });
      }
    });

    // Listen to usage data
    const usageRef = ref(database, `usage/${user.uid}`);
    const unsubscribeUsage = onValue(usageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Check if usage needs to be reset (24 hours passed)
        const lastReset = data.lastReset || 0;
        const now = Date.now();
        const hoursPassed = (now - lastReset) / (1000 * 60 * 60);

        if (hoursPassed >= 24) {
          // Reset usage
          const resetData = {
            convert: 0,
            resize: 0,
            compress: 0,
            edit: 0,
            background: 0,
            ai: 0,
            metadata: 0,
            batch: 0,
            lastReset: now
          };
          update(usageRef, resetData);
          setUsage(resetData);
        } else {
          setUsage(data);
        }
      } else {
        // Initialize usage data
        const initialUsage = {
          convert: 0,
          resize: 0,
          compress: 0,
          edit: 0,
          background: 0,
          ai: 0,
          metadata: 0,
          batch: 0,
          lastReset: Date.now()
        };
        update(usageRef, initialUsage);
        setUsage(initialUsage);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeUser();
      unsubscribeUsage();
    };
  }, [user]);

  const canUseFeature = (feature) => {
    // Login is mandatory - no guest access
    if (!user) return false;
    
    const plan = PLANS[userPlan.toUpperCase()];
    if (!plan) return false;

    const currentUsage = usage[feature] || 0;
    const limit = plan.limits[feature];

    return currentUsage < limit;
  };

  const incrementUsage = async (feature) => {
    // Login is mandatory - no guest usage tracking
    if (!user) return false;

    const usageRef = ref(database, `usage/${user.uid}`);
    const snapshot = await get(usageRef);
    const currentData = snapshot.val() || {};
    
    const newUsage = {
      ...currentData,
      [feature]: (currentData[feature] || 0) + 1
    };

    await update(usageRef, newUsage);
    return true;
  };

  const getRemainingUsage = (feature) => {
    // Login is mandatory - return 0 for guests
    if (!user) return 0;
    
    const plan = PLANS[userPlan.toUpperCase()];
    if (!plan) return 0;

    const currentUsage = usage[feature] || 0;
    const limit = plan.limits[feature];

    return Math.max(0, limit - currentUsage);
  };

  const getUsagePercentage = (feature) => {
    // Login is mandatory - return 100% for guests (blocked)
    if (!user) return 100;
    
    const plan = PLANS[userPlan.toUpperCase()];
    if (!plan) return 0;

    const currentUsage = usage[feature] || 0;
    const limit = plan.limits[feature];

    if (limit === 0) return 100;
    return Math.min(100, (currentUsage / limit) * 100);
  };

  const value = {
    usage,
    userPlan,
    canUseFeature,
    incrementUsage,
    getRemainingUsage,
    getUsagePercentage,
    loading
  };

  return (
    <UsageContext.Provider value={value}>
      {children}
    </UsageContext.Provider>
  );
};

