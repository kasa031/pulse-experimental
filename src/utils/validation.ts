/**
 * Input Validation Utilities
 * Secure validation of user input to prevent injections and invalid data
 */

/**
 * Validate email address
 * 
 * @param email - The email address to validate
 * @returns Object with `valid` (boolean) and `error` (string, if invalid)
 * 
 * @example
 * ```typescript
 * const result = validateEmail('test@example.com');
 * if (result.valid) {
 *   // Email is valid
 * }
 * ```
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Check length (prevent DoS)
  if (email.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  return { valid: true };
};

/**
 * Validate password with strength requirements
 * 
 * @param password - The password to validate
 * @returns Object with `valid` (boolean), `error` (string, if invalid), and `strength` ('weak' | 'medium' | 'strong')
 * 
 * Requirements:
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - Must contain both letters and numbers
 * 
 * @example
 * ```typescript
 * const result = validatePassword('MySecure123');
 * // Returns: { valid: true, strength: 'strong' }
 * ```
 */
export const validatePassword = (password: string): { valid: boolean; error?: string; strength?: 'weak' | 'medium' | 'strong' } => {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long' };
  }

  // Check password strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let score = 0;

  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  // Minimum requirement: at least one number and one letter
  if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain both letters and numbers' };
  }

  return { valid: true, strength };
};

/**
 * Sanitize text to prevent XSS (Cross-Site Scripting) attacks
 * 
 * @param text - The text to sanitize
 * @param maxLength - Maximum length of the text (default: 1000 characters)
 * @returns Sanitized text without HTML tags and with escaped HTML entities
 * 
 * @example
 * ```typescript
 * const safe = sanitizeText('<script>alert("xss")</script>');
 * // Returns: "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 * ```
 */
export const sanitizeText = (text: string, maxLength: number = 1000): string => {
  if (!text || typeof text !== 'string') return '';
  
  // Complete sanitization: Remove HTML tags first (including nested and malformed tags)
  // Use global flag and handle all variants of HTML tags
  let sanitized = text.replace(/<\/?[^>]+(>|$)/g, '');
  
  // Escape HTML entities in correct order for complete sanitization
  // Escape & first to avoid double escaping of already escaped entities
  sanitized = sanitized
    .replace(/&(?!amp;|lt;|gt;|quot;|#x27;|#x2F;|#39;)/g, '&amp;')  // Escape & that is not part of an entity
    .replace(/</g, '&lt;')   // Escape < (may remain after tag removal)
    .replace(/>/g, '&gt;')   // Escape > (may remain after tag removal)
    .replace(/"/g, '&quot;')  // Escape double quotes
    .replace(/'/g, '&#x27;') // Escape single quotes (use &#x27; not &#39;)
    .replace(/\//g, '&#x2F;'); // Escape forward slash for extra security
  
  // Trim and limit length
  sanitized = sanitized.trim().substring(0, maxLength);
  
  return sanitized;
};

/**
 * Validate poll title
 */
export const validatePollTitle = (title: string): { valid: boolean; error?: string } => {
  const sanitized = sanitizeText(title, 200);
  
  if (!sanitized || sanitized.trim().length < 5) {
    return { valid: false, error: 'Title must be at least 5 characters' };
  }

  if (sanitized.length > 200) {
    return { valid: false, error: 'Title must be at most 200 characters' };
  }

  return { valid: true };
};

/**
 * Validate poll description
 */
export const validatePollDescription = (description: string): { valid: boolean; error?: string } => {
  const sanitized = sanitizeText(description, 2000);
  
  if (!sanitized || sanitized.trim().length < 10) {
    return { valid: false, error: 'Description must be at least 10 characters' };
  }

  if (sanitized.length > 2000) {
    return { valid: false, error: 'Description must be at most 2000 characters' };
  }

  return { valid: true };
};

/**
 * Validate poll option
 */
export const validatePollOption = (option: string): { valid: boolean; error?: string } => {
  const sanitized = sanitizeText(option, 500);
  
  if (!sanitized || sanitized.trim().length < 2) {
    return { valid: false, error: 'Option must be at least 2 characters' };
  }

  if (sanitized.length > 500) {
    return { valid: false, error: 'Option must be at most 500 characters' };
  }

  return { valid: true };
};

/**
 * Validate option index
 */
export const validateOptionIndex = (index: number, maxOptions: number): { valid: boolean; error?: string } => {
  if (typeof index !== 'number' || isNaN(index)) {
    return { valid: false, error: 'Invalid choice' };
  }

  if (index < 0 || index >= maxOptions) {
    return { valid: false, error: 'Invalid choice' };
  }

  return { valid: true };
};

/**
 * Validate poll ID
 */
export const validatePollId = (pollId: string): { valid: boolean; error?: string } => {
  if (!pollId || typeof pollId !== 'string') {
    return { valid: false, error: 'Invalid poll ID' };
  }

  // Firestore ID format: alphanumeric, max 1500 bytes
  if (pollId.length > 1500) {
    return { valid: false, error: 'Poll ID is too long' };
  }

  // Check for potentially dangerous characters
  if (!/^[a-zA-Z0-9_-]+$/.test(pollId)) {
    return { valid: false, error: 'Invalid poll ID format' };
  }

  return { valid: true };
};


