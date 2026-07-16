/*
 * Scheduled ingest script (PoC).
 * Usage: node src/lib/scheduled_google_fit_ingest.js
 * The script refreshes tokens if needed, fetches recent heart-rate aggregates and
 * posts HDT entries to the local ingest endpoint (http://localhost:3000/api/zpect_ingest).
 * If the local server isn't running, it falls back to appending directly to zpect-hdt-store.json.
 */
const path = require('path');
const fs = require('fs');
const fetch = global.fetch || require('node-fetch');
const client = require('./googleFitClient');

const STORE_PATH = path.join(__dirname, 'zpect-hdt-store.json');

async function run() {
  try {
    let accessToken;
    try {
      accessToken = await client.getFreshAccessToken();
    } catch (e) {
      console.error('Failed to obtain access token:', e.message);
      process.exit(2);
    }

    const end = Date.now();
    const start = end - 1000 * 60 * 60 * 6; // last 6 hours
    const points = await client.fetchAggregateData(accessToken, start, end);
    console.log(`Fetched ${points.length} hr points`);

    const entries = points.map(p => ({
      userId: 'google-user',
      source: 'google-fit',
      timestamp: p.timestamp,
      metrics: { hr: p.value },
    }));

    // Try to POST to local ingest endpoint
    let posted = 0;
    for (const e of entries) {
      try {
        const res = await fetch('http://localhost:3000/api/zpect_ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(e),
        });
        if (res.ok) posted++;
        else throw new Error('ingest endpoint responded ' + res.status);
      } catch (err) {
        // fallback: append to local store
        console.warn('POST failed, appending to store:', err.message);
        let arr = [];
        try {
          arr = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8') || '[]');
        } catch (e) {}
        arr.push({ version: '0.1.0', receivedAt: Date.now(), ...e });
        fs.writeFileSync(STORE_PATH, JSON.stringify(arr, null, 2), 'utf8');
      }
    }

    console.log(`Posted ${posted}/${entries.length} entries to local ingest endpoint (others appended to store).`);
  } catch (err) {
    console.error('Scheduled ingest failed:', err);
    process.exit(1);
  }
}

run();
