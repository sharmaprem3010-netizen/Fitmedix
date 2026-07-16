'use strict';

/**
 * Exposome service wrapper (PoC).
 * Supports multiple providers via environment configuration.
 * Keep API keys in environment variables (DO NOT commit secrets).
 *
 * Environment variables:
 * - EXPOSOME_PROVIDER: 'openweather' or 'breezometer' (default: 'openweather')
 * - EXPOSOME_API_KEY: API key for chosen provider
 */

const DEFAULT_SAMPLE = {
  pm1: null,
  pm2_5: null,
  pm10: null,
  so2: null,
  pollen: { tree: 0, grass: 0, weed: 0 },
  temperature: null,
  pressure: null,
  humidity: null,
  aqi: null,
  fetchedAt: Date.now(),
};

async function fetchOpenWeather(lat, lon, apiKey) {
  // OpenWeather: Air Pollution and Current Weather
  // Air Pollution: https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API key}
  // Current Weather: https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric
  try {
    const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${encodeURIComponent(apiKey)}`;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${encodeURIComponent(apiKey)}&units=metric`;

    const [airRes, weatherRes] = await Promise.all([fetch(airUrl), fetch(weatherUrl)]);
    if (!airRes.ok) throw new Error(`air_pollution ${airRes.status}`);
    if (!weatherRes.ok) throw new Error(`weather ${weatherRes.status}`);

    const airJson = await airRes.json();
    const weatherJson = await weatherRes.json();

    // airJson.list[0].components contains pm2_5, pm10, so2, ... and main.aqi
    const comp = (airJson.list && airJson.list[0] && airJson.list[0].components) || {};
    const aqi = (airJson.list && airJson.list[0] && airJson.list[0].main && airJson.list[0].main.aqi) || null;

    return {
      pm2_5: comp.pm2_5 ?? null,
      pm10: comp.pm10 ?? null,
      pm1: comp.pm1 ?? null,
      so2: comp.so2 ?? null,
      aqi,
      temperature: weatherJson.main?.temp ?? null,
      pressure: weatherJson.main?.pressure ?? null,
      humidity: weatherJson.main?.humidity ?? null,
      fetchedAt: Date.now(),
      raw: { air: airJson, weather: weatherJson },
    };
  } catch (err) {
    return { error: String(err) };
  }
}

async function fetchBreezoMeter(lat, lon, apiKey) {
  // BreezoMeter has separate endpoints for air quality and pollen. This is a simplified example.
  try {
    const airUrl = `https://api.breezometer.com/air-quality/v2/current-conditions?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&key=${encodeURIComponent(apiKey)}&features=pollen`;
    const res = await fetch(airUrl);
    if (!res.ok) throw new Error(`breezometer ${res.status}`);
    const json = await res.json();

    // Map response to our schema loosely (provider docs vary)
    const data = {
      pm2_5: json.data?.indexes?.baqi?.categories?.pm2_5 ?? null,
      pm10: null,
      pm1: null,
      so2: null,
      aqi: json.data?.indexes?.baqi?.aqi ?? null,
      temperature: json.data?.weather?.temperature?.value ?? null,
      pressure: json.data?.weather?.pressure?.value ?? null,
      humidity: json.data?.weather?.humidity?.value ?? null,
      pollen: json.data?.datapoint_index?.pollen ?? DEFAULT_SAMPLE.pollen,
      fetchedAt: Date.now(),
      raw: json,
    };
    return data;
  } catch (err) {
    return { error: String(err) };
  }
}

export async function fetchExposome(lat, lon) {
  if (!lat || !lon) return { ok: false, error: 'missing location' };

  const provider = (process.env.EXPOSOME_PROVIDER || 'openweather').toLowerCase();
  const apiKey = process.env.EXPOSOME_API_KEY || null;

  if (!apiKey) {
    if (process.env.ALLOW_EXPOSOME_SAMPLE === 'true') {
      return {
        ok: true,
        data: {
          ...DEFAULT_SAMPLE,
          pm2_5: 12.5,
          pm10: 24.1,
          temperature: 26.3,
          pressure: 1012,
          pollen: { tree: 2, grass: 1, weed: 0 },
          fetchedAt: Date.now(),
        },
        note: 'no API key configured, returning synthetic sample',
      };
    }
    return { ok: false, error: 'EXPOSOME_API_KEY is missing' };
  }

  if (provider === 'openweather') {
    const res = await fetchOpenWeather(lat, lon, apiKey);
    if (res.error) return { ok: false, error: res.error };
    return { ok: true, data: res };
  }

  if (provider === 'breezometer') {
    const res = await fetchBreezoMeter(lat, lon, apiKey);
    if (res.error) return { ok: false, error: res.error };
    return { ok: true, data: res };
  }

  return { ok: false, error: `unsupported provider: ${provider}` };
}

export default { fetchExposome };
