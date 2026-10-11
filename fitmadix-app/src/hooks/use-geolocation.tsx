import { useCallback, useState } from "react";

interface UseGeolocationReturn {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook wrapping the browser Geolocation API.
 * Requests the user's current position on demand.
 */
export function useGeolocation(): UseGeolocationReturn {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location permission denied. Please allow location access.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location unavailable. Please try again.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out. Please try again.");
            break;
          default:
            setError("Could not get your location.");
        }
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000, // Cache for 1 minute
      },
    );
  }, []);

  return { latitude, longitude, loading, error, refresh };
}
