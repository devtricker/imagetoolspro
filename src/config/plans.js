// Pricing Plans Configuration

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    limits: {
      convert: 5,        // 5 conversions per day
      resize: 5,         // 5 resizes per day
      compress: 5,       // 5 compressions per day
      edit: 3,           // 3 edits per day
      background: 2,     // 2 background operations per day
      ai: 0,             // No AI tools
      metadata: 5,       // 5 metadata operations per day
      batch: 0,          // No batch processing
      maxFileSize: 5     // 5 MB max file size
    },
    features: [
      '5 conversions per day',
      '5 resize operations per day',
      '5 compressions per day',
      '3 edits per day',
      '2 background operations per day',
      '5 metadata operations per day',
      'Max 5MB file size',
      'Login required',
      'No AI tools',
      'No batch processing'
    ]
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 0,
    currency: 'USD',
    limits: {
      convert: 100,      // 100 conversions per day
      resize: 100,       // 100 resizes per day
      compress: 100,     // 100 compressions per day
      edit: 50,          // 50 edits per day
      background: 30,    // 30 background operations per day
      ai: 20,            // 20 AI operations per day
      metadata: 100,     // 100 metadata operations per day
      batch: 50,         // 50 batch operations per day
      maxFileSize: 50    // 50 MB max file size
    },
    features: [
      '100 conversions per day',
      '100 resize operations per day',
      '100 compressions per day',
      '50 edits per day',
      '30 background operations per day',
      '20 AI operations per day',
      '100 metadata operations per day',
      '50 batch operations per day',
      'Max 50MB file size',
      'Priority support',
      'No ads'
    ]
  }
};

// Razorpay Test API Keys
export const RAZORPAY_CONFIG = {
  key: 'rzp_test_1DP5mmOlF5G5ag', // Test key (replace with your test key)
  currency: 'USD',
  name: 'ImageToolsPro',
  description: 'Premium Plan - Unlimited Access',
  image: '/logo.png',
  theme: {
    color: '#6366f1'
  }
};

// Usage tracking reset time (24 hours)
export const USAGE_RESET_HOURS = 24;

