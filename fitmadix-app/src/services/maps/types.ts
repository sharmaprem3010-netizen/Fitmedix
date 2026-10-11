export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapProviderStatus {
  isConfigured: boolean;
  provider: 'google-maps' | 'openstreetmap' | 'none';
  statusMessage: string;
}

export interface MapsServiceInterface {
  getProviderStatus(): Promise<MapProviderStatus>;
  getUserLocation(): Promise<GeoCoordinates | null>;
  searchHealthcarePlaces(query: string, location?: GeoCoordinates): Promise<any[]>;
}
