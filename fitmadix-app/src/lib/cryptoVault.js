'use strict';

import crypto from 'crypto';

function resolveKeyBuffer() {
  const raw = process.env.ZPECT_TOKEN_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('Missing ZPECT_TOKEN_ENCRYPTION_KEY');
  }

  if (/^[A-Fa-f0-9]{64}$/.test(raw)) {
    return Buffer.from(raw, 'hex');
  }

  try {
    const b64 = Buffer.from(raw, 'base64');
    if (b64.length === 32) {
      return b64;
    }
  } catch (e) {
    // no-op
  }

  return crypto.createHash('sha256').update(raw).digest();
}

export function encryptJson(payload) {
  const key = resolveKeyBuffer();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    v: 1,
    alg: 'aes-256-gcm',
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64'),
  };
}

export function decryptJson(blob) {
  if (!blob || typeof blob !== 'object') {
    throw new Error('invalid encrypted blob');
  }

  const key = resolveKeyBuffer();
  const iv = Buffer.from(blob.iv, 'base64');
  const tag = Buffer.from(blob.tag, 'base64');
  const data = Buffer.from(blob.data, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  return JSON.parse(out);
}

export default { encryptJson, decryptJson };
