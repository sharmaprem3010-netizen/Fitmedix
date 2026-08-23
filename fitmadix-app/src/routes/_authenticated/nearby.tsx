import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { findNearbyFacilities } from "@/lib/nearby-facilities.functions";

export const Route = createFileRoute("/_authenticated/nearby")({
  component: NearbyPage,
});

type Facility = {
  name: string;
  type: "hospital" | "clinic" | "pharmacy" | "doctors";
  lat: number;
  lng: number;
  distance_km: number;
  phone?: string;
  address?: string;
};

const typeConfig = {
  hospital: { emoji: "🏥", label: "Hospital", color: "text-red-500", bg: "bg-red-500/10" },
  clinic: { emoji: "🩺", label: "Clinic", color: "text-blue-500", bg: "bg-blue-500/10" },
  pharmacy: { emoji: "💊", label: "Pharmacy", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  doctors: { emoji: "👨‍⚕️", label: "Doctor", color: "text-purple-500", bg: "bg-purple-500/10" },
};

function NearbyPage() {
  const { latitude, longitude, loading: geoLoading, error: geoError, refresh } = useGeolocation();
  const { speak } = useTextToSpeech();
  const search = useServerFn(findNearbyFacilities);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filter, setFilter] = useState<"all" | "hospital" | "clinic" | "pharmacy" | "doctors">(
    "all",
  );

  // Auto-request location on mount
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-search when location is available
  useEffect(() => {
    if (latitude && longitude && !searched) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  const handleSearch = async () => {
    if (!latitude || !longitude) return;
    setSearching(true);
    try {
      const res = await search({ data: { lat: latitude, lng: longitude, radius_km: 5 } });
      setFacilities(res.facilities as Facility[]);
      setSearched(true);
      // Voice announce nearest facility
      if (res.facilities.length > 0) {
        const nearest = res.facilities[0] as Facility;
        const cfg = typeConfig[nearest.type];
        speak(
          `Found ${res.facilities.length} health facilities nearby. The closest is ${nearest.name}, a ${cfg.label}, ${nearest.distance_km} kilometers away.`,
        );
      } else {
        speak("No health facilities found within 5 kilometers.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const filtered = filter === "all" ? facilities : facilities.filter((f) => f.type === filter);

  const openDirections = (f: Facility) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${f.lat},${f.lng}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/chat"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">📍 Nearby Health Facilities</h1>
            <p className="text-xs text-muted-foreground">
              Find hospitals, clinics, and pharmacies near you
            </p>
          </div>
        </div>

        {/* Location Status */}
        {(geoLoading || searching) && (
          <div className="mb-6 flex flex-col items-center gap-3 rounded-3xl border border-border bg-card py-16 shadow-elegant">
            <div className="relative">
              <MapPin className="h-12 w-12 text-primary animate-bounce" />
            </div>
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {geoLoading ? "Finding your location..." : "Searching nearby facilities..."}
            </p>
          </div>
        )}

        {/* Error */}
        {geoError && (
          <div className="mb-6 rounded-3xl border border-border bg-card p-8 text-center shadow-elegant">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">Location Needed</h2>
            <p className="mt-2 text-sm text-muted-foreground">{geoError}</p>
            <button
              onClick={refresh}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              <RefreshCw className="h-4 w-4" /> Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {searched && !searching && (
          <>
            {/* Filter chips */}
            <div className="mb-4 flex flex-wrap gap-2">
              {(["all", "hospital", "clinic", "pharmacy", "doctors"] as const).map((f) => {
                const active = filter === f;
                const label =
                  f === "all"
                    ? `All (${facilities.length})`
                    : `${typeConfig[f].emoji} ${typeConfig[f].label} (${facilities.filter((x) => x.type === f).length})`;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                      active
                        ? "bg-foreground text-background"
                        : "border border-border bg-card text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Facility Cards */}
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-elegant">
                <MapPin className="mx-auto h-10 w-10 text-muted-foreground" />
                <h2 className="mt-3 text-lg font-semibold">No facilities found</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try expanding your search or check a different category.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((f, i) => {
                  const cfg = typeConfig[f.type];
                  return (
                    <div
                      key={i}
                      className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg ${cfg.bg}`}
                        >
                          {cfg.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-semibold leading-tight">{f.name}</h3>
                            <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                              {f.distance_km} km
                            </span>
                          </div>
                          <p className={`mt-0.5 text-xs font-medium ${cfg.color}`}>{cfg.label}</p>
                          {f.address && (
                            <p className="mt-1 text-xs text-muted-foreground truncate">
                              {f.address}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => openDirections(f)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-primary px-3 py-2.5 text-xs font-medium text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
                        >
                          <Navigation className="h-3.5 w-3.5" /> Navigate
                        </button>
                        {f.phone && (
                          <a
                            href={`tel:${f.phone}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-medium text-foreground hover:bg-secondary"
                          >
                            <Phone className="h-3.5 w-3.5" /> Call
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Refresh button */}
            <button
              onClick={() => {
                setSearched(false);
                refresh();
              }}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <RefreshCw className="h-4 w-4" /> Refresh Results
            </button>
          </>
        )}
      </div>
    </div>
  );
}
