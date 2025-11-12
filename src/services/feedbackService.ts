/**
 * Feedback Service
 * Håndterer sending av feilrapporter og tilbakemeldinger via EmailJS
 */

import emailjs from '@emailjs/browser';
import Constants from 'expo-constants';
import { auth } from './firebase';
import { safeError, safeLog } from '../utils/performance';
import { getAppVersion } from '../utils/version';
import { Platform } from 'react-native';
import { sanitizeText } from '../utils/validation';

interface FeedbackData {
  subject: string;
  message: string;
  type: 'bug' | 'feature' | 'feedback' | 'other';
  screen?: string;
  userEmail?: string;
  userName?: string;
}

/**
 * Hent EmailJS konfigurasjon
 */
const getEmailJSConfig = () => {
  const extra = Constants.expoConfig?.extra;
  
  return {
    publicKey: process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY || extra?.emailjsPublicKey || '',
    serviceId: process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID || extra?.emailjsServiceId || '',
    templateId: process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID || extra?.emailjsTemplateId || '',
  };
};

/**
 * Send feilrapport eller tilbakemelding via EmailJS
 * 
 * @param data - FeedbackData objekt med emne, melding, type, etc.
 * @returns true hvis sending var vellykket
 * @throws Error hvis EmailJS ikke er konfigurert eller sending feiler
 * 
 * Alle brukerinput sanitizes automatisk før sending.
 * 
 * @example
 * ```typescript
 * await sendFeedback({
 *   subject: 'Feil i appen',
 *   message: 'Jeg oppdaget en feil...',
 *   type: 'bug',
 *   screen: 'VoteScreen'
 * });
 * ```
 */
export const sendFeedback = async (data: FeedbackData): Promise<boolean> => {
  try {
    const config = getEmailJSConfig();
    
    // Check that configuration is set
    if (!config.publicKey || !config.serviceId || !config.templateId) {
      throw new Error('EmailJS is not configured. Check that API keys are set.');
    }

    // Initialiser EmailJS
    emailjs.init(config.publicKey);

    // Hent brukerinfo hvis tilgjengelig
    const user = auth?.currentUser;
    const appVersion = getAppVersion();

    // Forbered template parameters (sanitize all user input)
    const templateParams = {
      from_name: sanitizeText(data.userName || user?.displayName || 'Anonym bruker', 100),
      from_email: data.userEmail || user?.email || 'ikke-angitt@example.com',
      subject: sanitizeText(data.subject, 200),
      message: sanitizeText(data.message, 2000),
      feedback_type: data.type,
      screen_name: sanitizeText(data.screen || 'Ukjent', 50),
      app_version: appVersion,
      platform: Platform.OS,
      user_email: user?.email || 'Ikke innlogget',
      user_id: user?.uid || 'Ikke innlogget',
      timestamp: new Date().toISOString(),
    };

    // Send e-post
    const response = await emailjs.send(
      config.serviceId,
      config.templateId,
      templateParams
    );

    safeLog('Feedback sendt:', response);
    return true;
  } catch (error) {
    safeError('Feil ved sending av feedback:', error);
    throw error;
  }
};

/**
 * Send feilrapport med automatisk informasjon
 */
export const reportBug = async (
  error: Error | string,
  screen?: string,
  additionalInfo?: string
): Promise<boolean> => {
  try {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? '' : error.stack || '';

    const message = `Feilmelding: ${errorMessage}\n\n` +
      (errorStack ? `Stack trace:\n${errorStack}\n\n` : '') +
      (additionalInfo ? `Tilleggsinfo:\n${additionalInfo}\n\n` : '') +
      `Plattform: ${Platform.OS}\n` +
      `Versjon: ${getAppVersion()}\n` +
      `Tidspunkt: ${new Date().toISOString()}`;

    return await sendFeedback({
      subject: `[BUG] ${errorMessage.substring(0, 50)}`,
      message,
      type: 'bug',
      screen: screen || 'Ukjent',
    });
  } catch (error) {
    safeError('Feil ved rapportering av bug:', error);
    return false;
  }
};

/**
 * Sjekk om EmailJS er konfigurert
 */
export const isEmailJSConfigured = (): boolean => {
  const config = getEmailJSConfig();
  return !!(config.publicKey && config.serviceId && config.templateId);
};

