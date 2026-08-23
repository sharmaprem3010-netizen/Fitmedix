import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

interface Facility {
  name: string;
  type: "hospital" | "clinic" | "pharmacy" | "doctors";
  lat: number;
  lng: number;
  distance_km: number;
  phone?: string;
  address?: string;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const findNearbyFacilities = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { lat: number; lng: number; radius_km?: number }) =>
    z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        radius_km: z.number().min(1).max(50).optional().default(5),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { lat, lng, radius_km } = data;
    const radiusMeters = radius_km * 1000;

    // Overpass QL query for health amenities
    const query = `
      [out:json][timeout:15];
      (
        node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
        node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
        node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
        node["amenity"="doctors"](around:${radiusMeters},${lat},${lng});
        way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
        way["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
        way["amenity"="pharmacy"](around:${radiusMeters},${lat},${lng});
      );
      out center body;
    `;

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!res.ok) {
      throw new Error("Could not search for nearby facilities. Please try again.");
    }

    const json = (await res.json()) as any;
    const elements = json.elements ?? [];

    const facilities: Facility[] = elements
      .map((el: any) => {
        const elLat = el.lat ?? el.center?.lat;
        const elLng = el.lon ?? el.center?.lon;
        if (!elLat || !elLng) return null;

        const tags = el.tags ?? {};
        const name = tags.name || tags["name:en"] || tags.operator || "Unknown Facility";
        const amenity = tags.amenity as string;

        const typeMap: Record<string, Facility["type"]> = {
          hospital: "hospital",
          clinic: "clinic",
          pharmacy: "pharmacy",
          doctors: "doctors",
        };

        return {
          name,
          type: typeMap[amenity] ?? "clinic",
          lat: elLat,
          lng: elLng,
          distance_km: Math.round(haversineDistance(lat, lng, elLat, elLng) * 100) / 100,
          phone: tags.phone || tags["contact:phone"] || undefined,
          address:
            [tags["addr:street"], tags["addr:city"], tags["addr:postcode"]]
              .filter(Boolean)
              .join(", ") || undefined,
        } as Facility;
      })
      .filter(Boolean)
      .sort((a: Facility, b: Facility) => a.distance_km - b.distance_km)
      .slice(0, 20); // Cap at 20 results

    return { facilities };
  });
