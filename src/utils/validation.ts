/**
 * Input Validation Utilities
 * Sikker validering av brukerinput for å forhindre injeksjoner og ugyldige data
 */

/**
 * Valider e-postadresse
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'E-post er påkrevd' };
  }

  // Grunnleggende e-post validering
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Ugyldig e-postformat' };
  }

  // Sjekk lengde (forhindre DoS)
  if (email.length > 254) {
    return { valid: false, error: 'E-post er for lang' };
  }

  return { valid: true };
};

/**
 * Valider passord med styrke-krav
 */
export const validatePassword = (password: string): { valid: boolean; error?: string; strength?: 'weak' | 'medium' | 'strong' } => {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Passord må være minst 8 tegn' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Passord er for langt' };
  }

  // Sjekk passord styrke
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let score = 0;

  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  // Minimum krav: minst ett tall og ett bokstav
  if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
    return { valid: false, error: 'Passord må inneholde både bokstaver og tall' };
  }

  return { valid: true, strength };
};

/**
 * Sanitize tekst for å forhindre XSS
 */
export const sanitizeText = (text: string, maxLength: number = 1000): string => {
  if (!text || typeof text !== 'string') return '';
  
  // Fjern HTML tags først (komplett sanitization - håndterer alle HTML tags)
  // Bruk non-greedy matching for å fange alle tags, inkludert nested tags
  let sanitized = text.replace(/<[^>]+>/g, '');
  
  // Escape HTML entities (må gjøres etter tag removal for komplett sanitization)
  // Escape & først for å unngå dobbel escaping
  sanitized = sanitized
    .replace(/&/g, '&amp;')  // Må gjøres først for å unngå dobbel escaping
    .replace(/</g, '&lt;')   // Escape < (kan være igjen etter tag removal)
    .replace(/>/g, '&gt;')   // Escape > (kan være igjen etter tag removal)
    .replace(/"/g, '&quot;')  // Escape doble anførselstegn
    .replace(/'/g, '&#x27;') // Escape enkle anførselstegn
    .replace(/\//g, '&#x2F;'); // Escape forward slash for ekstra sikkerhet
  
  // Trim og begrens lengde
  sanitized = sanitized.trim().substring(0, maxLength);
  
  return sanitized;
};

/**
 * Valider poll title
 */
export const validatePollTitle = (title: string): { valid: boolean; error?: string } => {
  const sanitized = sanitizeText(title, 200);
  
  if (!sanitized || sanitized.trim().length < 5) {
    return { valid: false, error: 'Tittel må være minst 5 tegn' };
  }

  if (sanitized.length > 200) {
    return { valid: false, error: 'Tittel må være maks 200 tegn' };
  }

  return { valid: true };
};

/**
 * Valider poll description
 */
export const validatePollDescription = (description: string): { valid: boolean; error?: string } => {
  const sanitized = sanitizeText(description, 2000);
  
  if (!sanitized || sanitized.trim().length < 10) {
    return { valid: false, error: 'Beskrivelse må være minst 10 tegn' };
  }

  if (sanitized.length > 2000) {
    return { valid: false, error: 'Beskrivelse må være maks 2000 tegn' };
  }

  return { valid: true };
};

/**
 * Valider poll option
 */
export const validatePollOption = (option: string): { valid: boolean; error?: string } => {
  const sanitized = sanitizeText(option, 500);
  
  if (!sanitized || sanitized.trim().length < 2) {
    return { valid: false, error: 'Alternativ må være minst 2 tegn' };
  }

  if (sanitized.length > 500) {
    return { valid: false, error: 'Alternativ må være maks 500 tegn' };
  }

  return { valid: true };
};

/**
 * Valider option index
 */
export const validateOptionIndex = (index: number, maxOptions: number): { valid: boolean; error?: string } => {
  if (typeof index !== 'number' || isNaN(index)) {
    return { valid: false, error: 'Ugyldig valg' };
  }

  if (index < 0 || index >= maxOptions) {
    return { valid: false, error: 'Ugyldig valg' };
  }

  return { valid: true };
};

/**
 * Valider poll ID
 */
export const validatePollId = (pollId: string): { valid: boolean; error?: string } => {
  if (!pollId || typeof pollId !== 'string') {
    return { valid: false, error: 'Ugyldig avstemning ID' };
  }

  // Firestore ID format: alphanumeric, max 1500 bytes
  if (pollId.length > 1500) {
    return { valid: false, error: 'Avstemning ID er for lang' };
  }

  // Sjekk for potensielt farlige tegn
  if (!/^[a-zA-Z0-9_-]+$/.test(pollId)) {
    return { valid: false, error: 'Ugyldig avstemning ID format' };
  }

  return { valid: true };
};


