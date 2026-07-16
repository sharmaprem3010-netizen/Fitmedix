'use strict';

/**
 * OAuth helper configuration for Google Fit / Health Connect PoC.
 * Do NOT commit secrets. Set these in your environment (e.g., .env.local for Next.js):
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 * - GOOGLE_REDIRECT_URI (e.g., https://yourdomain.com/api/oauth_google_fit_callback)
 *
 * Scopes used (modify as needed):
 * - https://www.googleapis.com/auth/fitness.activity.read
 * - https://www.googleapis.com/auth/fitness.heart_rate.read
 * - https://www.googleapis.com/auth/fitness.sleep.read
 * - openid email profile
 */

export const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'openid',
  'email',
  'profile',
];

export function buildGoogleAuthUrl({ clientId, redirectUri, state }) {
  const scopes = GOOGLE_FIT_SCOPES.join(' ');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline', // request refresh token
    prompt: 'consent',
    state: state || 'zpect-' + Date.now(),
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function tokenEndpoint() {
  return 'https://oauth2.googleapis.com/token';
}
