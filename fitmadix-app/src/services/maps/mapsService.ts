import { GeoCoordinates, MapProviderStatus, MapsServiceInterface } from './types.ts';

export class MapsService implements MapsServiceInterface {
  public async getProviderStatus(): Promise<MapProviderStatus> {
    return {
      isConfigured: false,
      provider: 'none',
      statusMessage:
        'Map place API is not yet provisioned. FitMadix adheres to strict empirical guidelines: fabricated hospital markers and invented ratings are prohibited.',
    };
  }

  public async getUserLocation(): Promise<GeoCoordinates | null> {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => resolve(null),
        { timeout: 8000 }
      );
    });
  }

  public async searchHealthcarePlaces(_query: string, _location?: GeoCoordinates): Promise<any[]> {
    // Zero fabricated locations
    return [];
  }
}

export const mapsService = new MapsService();
