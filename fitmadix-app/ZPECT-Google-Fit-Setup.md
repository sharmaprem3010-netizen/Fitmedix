Z-PECT — Google Fit / Health Connect Setup (PoC)

Overview

This document outlines the minimal steps to enable Google Fit ingestion for the Z-PECT PoC. The scaffold provides three server endpoints:

- GET /api/oauth_google_fit_authorize — redirects user to Google consent screen
- GET /api/oauth_google_fit_callback — OAuth callback that exchanges code for tokens and persists them (PoC)
- POST /api/webhook_google_fit — webhook endpoint to receive push notifications / sample payloads

Important environment variables (Next.js .env.local):

- GOOGLE_CLIENT_ID — OAuth client ID
- GOOGLE_CLIENT_SECRET — OAuth client secret
- GOOGLE_REDIRECT_URI — The redirect URI (must match OAuth console; e.g., https://yourdomain.com/api/oauth_google_fit_callback)
- EXPOSOME_PROVIDER / EXPOSOME_API_KEY — for exposome integration (optional)

Required OAuth Scopes (suggested):
- https://www.googleapis.com/auth/fitness.activity.read
- https://www.googleapis.com/auth/fitness.heart_rate.read
- https://www.googleapis.com/auth/fitness.sleep.read
- openid email profile

Local testing steps

1. Set env vars in .env.local and restart Next dev server.
2. Visit /api/oauth_google_fit_authorize to start consent flow. After consenting, Google will redirect to the configured redirect URI which triggers token exchange and persists tokens to src/lib/google_fit_tokens.json (PoC).
3. Use the persisted refresh_token to call Google Fit REST APIs server-side and fetch historic data; map to HDT schema then POST to /api/zpect_ingest or append directly to src/lib/zpect-hdt-store.json for testing.
4. To test webhook flow, POST sample payloads to /api/webhook_google_fit. For real push notifications, Google Fit uses Cloud Pub/Sub — production requires a Pub/Sub subscriber or intermediary to forward messages to this webhook.

Security notes

- Do NOT commit .env.local or token files to source control. For production, encrypt token storage and use a secure secrets manager.
- This PoC persists tokens and HDT entries in plaintext local files for development convenience only.

Next steps

- Implement server-side token refresh and scheduled ingestion using refresh_token.
- Implement Health Connect (Android) integration or an iOS on-device sync flow for Apple Health (requires platform-specific code or mobile SDK).
- Replace plaintext token storage with an encrypted store and add per-user scoping.
- Build client-side consent UI and onboarding to request permissions and pair devices.
