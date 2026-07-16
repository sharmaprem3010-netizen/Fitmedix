'use strict';

import dbConnect from '@/lib/db';
import OAuthCredential from '@/models/OAuthCredential';
import { decryptJson, encryptJson } from '@/lib/cryptoVault';

export async function saveProviderTokens({ provider, subject = 'default', tokens, state = null }) {
  if (!provider) throw new Error('provider is required');
  if (!tokens || typeof tokens !== 'object') throw new Error('tokens payload is required');

  await dbConnect();
  const encryptedPayload = encryptJson(tokens);
  const doc = await OAuthCredential.findOneAndUpdate(
    { provider, subject },
    { provider, subject, encryptedPayload, state, lastRefreshedAt: new Date() },
    { upsert: true, new: true }
  );
  return doc;
}

export async function getProviderTokens({ provider, subject = 'default' }) {
  if (!provider) throw new Error('provider is required');
  await dbConnect();
  const doc = await OAuthCredential.findOne({ provider, subject }).lean();
  if (!doc) return null;
  return decryptJson(doc.encryptedPayload);
}

export async function hasProviderTokens({ provider, subject = 'default' }) {
  if (!provider) throw new Error('provider is required');
  await dbConnect();
  const count = await OAuthCredential.countDocuments({ provider, subject });
  return count > 0;
}

export async function getFreshAccessToken({ provider, subject }) {
  if (!provider || !subject) throw new Error('provider and subject are required');
  const tokens = await getProviderTokens({ provider, subject });
  if (!tokens) return null;

  await dbConnect();
  const doc = await OAuthCredential.findOne({ provider, subject }).lean();
  if (!doc) return null;

  const receivedAt = doc.lastRefreshedAt ? doc.lastRefreshedAt.getTime() : doc.createdAt.getTime();
  const expiresIn = tokens.expires_in || 3600;

  // Check if expired
  if (Date.now() < receivedAt + (expiresIn * 1000) - 60000) {
    return tokens.access_token;
  }

  // Refresh token
  if (!tokens.refresh_token) {
    throw new Error('No refresh token available to refresh access token');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: tokens.refresh_token,
    grant_type: 'refresh_token',
  });

  const { tokenEndpoint } = await import('@/lib/oauthConfig');
  const res = await fetch(tokenEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const json = await res.json();
  if (!res.ok) throw new Error('refresh failed: ' + JSON.stringify(json));

  const newTokens = Object.assign({}, tokens, json);
  
  await saveProviderTokens({
    provider,
    subject,
    tokens: newTokens,
    state: doc.state
  });

  return newTokens.access_token;
}

export default { saveProviderTokens, getProviderTokens, hasProviderTokens, getFreshAccessToken };
