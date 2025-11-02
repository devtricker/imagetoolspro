// Allowed email domains - Only legitimate email providers
const ALLOWED_DOMAINS = [
  // Gmail
  'gmail.com',
  'googlemail.com',
  
  // Outlook/Microsoft
  'outlook.com',
  'hotmail.com',
  'live.com',
  
  // Yahoo
  'yahoo.com',
  'ymail.com',
  
  // Apple
  'icloud.com',
  'me.com',
  
  // Zoho
  'zoho.com',
  
  // Mail.com
  'mail.com',
];

// Known temporary/disposable email domains to block
const BLOCKED_DOMAINS = [
  // Emailnator domains
  'emailnator.com',
  'custom.emailnator.com',
  
  // Common temp mail services
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'mailinator.com',
  'maildrop.cc',
  '10minutemail.com',
  'throwaway.email',
  'getnada.com',
  'trashmail.com',
  'fakeinbox.com',
  'temp-mail.io',
  'mohmal.com',
  'sharklasers.com',
  'guerrillamail.info',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.de',
  'spam4.me',
  'tempinbox.com',
  'mintemail.com',
  'mytemp.email',
  'tempmail.net',
  'dispostable.com',
  'yopmail.com',
  'mailnesia.com',
  'mailcatch.com',
  'emailondeck.com',
  'tempr.email',
  'getairmail.com',
  'throwawaymail.com',
];

// Patterns that indicate disposable/temporary emails
const SUSPICIOUS_PATTERNS = [
  /\+.*@gmail\.com$/i,           // Gmail with + (like gugtenterf+xjf57@gmail.com)
  /^[a-z0-9]+\.[a-z0-9]+\.[a-z0-9]+\.[a-z0-9]+\.[a-z0-9]+@/i,  // Multiple dots (like l.u.c.if.er.231.98.7@gmail.com)
  /^[a-z]+\.[a-z]+\.[a-z]+\.[a-z]+\.[0-9]+@/i,  // Pattern like ch.ardl.o.o.62@gmail.com
  /^[a-z]+\.[a-z]+\.[a-z]+\.[a-z]+\.[a-z]+\.[0-9]+@/i,  // Pattern like chloea.be.l.e.0.7@googlemail.com
  /\d{3,}@/i,                     // 3+ consecutive numbers before @
  /^[a-z]{1,2}\.[a-z]{1,2}\.[a-z]{1,2}\./i,  // Single/double letter dots pattern
];

/**
 * Validates if an email is from an allowed domain and not a temporary email
 * @param {string} email - Email address to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Extract domain
  const domain = email.toLowerCase().split('@')[1];
  const localPart = email.toLowerCase().split('@')[0];

  // Check if domain is blocked
  if (BLOCKED_DOMAINS.includes(domain)) {
    return { 
      valid: false, 
      error: 'Temporary/disposable email addresses are not allowed. Please use a legitimate email provider.' 
    };
  }

  // Check for suspicious patterns (emailnator-style emails)
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(email.toLowerCase())) {
      return { 
        valid: false, 
        error: 'This email pattern is not allowed. Please use a standard email address.' 
      };
    }
  }

  // Check if domain is in allowed list
  if (!ALLOWED_DOMAINS.includes(domain)) {
    return { 
      valid: false, 
      error: `Only emails from legitimate providers are allowed (Gmail, Outlook, Yahoo, iCloud, Zoho, Mail.com, etc.)` 
    };
  }

  // Additional check: Gmail/Googlemail with excessive dots
  if ((domain === 'gmail.com' || domain === 'googlemail.com')) {
    const dotCount = (localPart.match(/\./g) || []).length;
    if (dotCount > 2) {
      return { 
        valid: false, 
        error: 'This email pattern is not allowed. Please use a standard email address.' 
      };
    }
  }

  return { valid: true, error: '' };
};

/**
 * Check if email domain is allowed
 * @param {string} email 
 * @returns {boolean}
 */
export const isAllowedDomain = (email) => {
  const domain = email.toLowerCase().split('@')[1];
  return ALLOWED_DOMAINS.includes(domain);
};

/**
 * Check if email is from a blocked domain
 * @param {string} email 
 * @returns {boolean}
 */
export const isBlockedDomain = (email) => {
  const domain = email.toLowerCase().split('@')[1];
  return BLOCKED_DOMAINS.includes(domain);
};

/**
 * Get list of allowed email providers for display
 * @returns {string[]}
 */
export const getAllowedProviders = () => {
  return [
    'Gmail',
    'Outlook/Hotmail',
    'Yahoo Mail',
    'iCloud',
    'Zoho Mail',
    'Mail.com'
  ];
};
