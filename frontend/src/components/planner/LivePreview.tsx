import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Badge } from "../ui/badge"
import { Clock, Fuel, ShieldAlert, Navigation, Calendar } from "lucide-react"
import { RouteMap } from "../shared/RouteMap"
import type { StopCoordinate } from "../shared/RouteMap"


interface LivePreviewProps {
  formData: {
    currentLocation: string;
    pickupLocation: string;
    dropoffLocation: string;
    currentCycleUsed: number;
    currentDrivingHoursToday: number;
    currentOnDutyHoursToday: number;
    fuelCapacity: number;
    mpgEstimate: number;
    optimizeFuel: boolean;
    avoidTolls: boolean;
    preferTruckSafe: boolean;
    includeOvernight: boolean;
    autoHOS: boolean;
    startDate: string;
    startTime: string;
  };
}

const HUBS: Record<string, [number, number]> = {
  "dallas": [32.7767, -96.7970],
  "houston": [29.7604, -95.3698],
  "miami": [25.7617, -80.1918],
  "atlanta": [33.7490, -84.3880],
  "chicago": [41.8781, -87.6298],
  "orlando": [28.5384, -81.3789],
  "new york": [40.7128, -74.0060],
  "los angeles": [34.0522, -118.2437],
  "seattle": [47.6062, -122.3321],
  "denver": [39.7392, -104.9903],
  "birmingham": [33.5186, -86.8104],
}

export function LivePreview({ formData }: LivePreviewProps) {
  const [mapPath, setMapPath] = useState<[number, number][]>([])
  const [mapStops, setMapStops] = useState<StopCoordinate[]>([])

  const [distance, setDistance] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [fuelNeeded, setFuelNeeded] = useState<number>(0)
  const [stopsCount, setStopsCount] = useState<number>(0)

  // Debounced geocoding effect for dynamic OpenStreetMap updates
  useEffect(() => {
    if (!formData.pickupLocation || !formData.dropoffLocation) {
      setMapPath([]);
      setMapStops([]);
      setDistance(0);
      setHours(0);
      setFuelNeeded(0);
      setStopsCount(0);
      return;
    }

    const timer = setTimeout(async () => {
      let c1: [number, number] | null = null;
      let c2: [number, number] | null = null;
      let c3: [number, number] | null = null;

      const resolveCoords = async (loc: string) => {
        if (!loc) return null;
        const clean = loc.toLowerCase().trim();
        const matched = Object.keys(HUBS).find(k => clean.includes(k));
        if (matched) return HUBS[matched];

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(loc)}`);
          const data = await res.json();
          if (data && data[0]) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
          }
        } catch (e) {
          console.error("OSM geocode lookup failed in LivePreview", e);
        }
        return null;
      };

      // Resolve all 3 locations
      if (formData.currentLocation) {
        c1 = await resolveCoords(formData.currentLocation);
      }
      c2 = await resolveCoords(formData.pickupLocation);
      c3 = await resolveCoords(formData.dropoffLocation);

      if (c2 && c3) {
        // Haversine distance formula with winding/highway scale
        const getDistance = (coords1: [number, number], coords2: [number, number]) => {
          const R = 3958.8; // miles
          const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
          const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c * 1.18; // 18% highway winding factor
        };

        const distPrimary = getDistance(c2, c3);
        const hoursPrimary = distPrimary / 58.0; // matching backend truck speed

        let totalDist = distPrimary;
        let totalHrs = hoursPrimary + 1.0; // 1.0 hr pickup loading

        const previewStops: StopCoordinate[] = [];

        // If currentLocation is resolved and different from pickupLocation
        if (c1 && (Math.abs(c1[0] - c2[0]) > 0.05 || Math.abs(c1[1] - c2[1]) > 0.05)) {
          const distTransit = getDistance(c1, c2);
          const hoursTransit = distTransit / 58.0;

          totalDist = distTransit + distPrimary;
          totalHrs = hoursTransit + hoursPrimary + 1.5; // +30m inspection, +1h loading

          previewStops.push({
            id: "preview-current",
            name: formData.currentLocation,
            type: "pickup",
            coords: c1,
            time: "Start",
            details: "Dispatch Location"
          });
        }

        previewStops.push(
          {
            id: "preview-pickup",
            name: formData.pickupLocation,
            type: "pickup",
            coords: c2,
            time: "Departure",
            details: "Origin Loading Point"
          },
          {
            id: "preview-dropoff",
            name: formData.dropoffLocation,
            type: "dropoff",
            coords: c3,
            time: "Arrival",
            details: "Destination Unloading Point"
          }
        );

        // Build curved polyline path spanning all points
        const buildCurvedPath = (pA: [number, number], pB: [number, number], steps = 15) => {
          const path: [number, number][] = [];
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const offset = 0.15 * Math.sin(t * Math.PI);
            const lat = pA[0] + (pB[0] - pA[0]) * t + offset * (pB[1] - pA[1]) * 0.12;
            const lon = pA[1] + (pB[1] - pA[1]) * t - offset * (pB[0] - pA[0]) * 0.12;
            path.push([lat, lon]);
          }
          return path;
        };

        let combinedPath: [number, number][] = [];
        if (c1 && (Math.abs(c1[0] - c2[0]) > 0.05 || Math.abs(c1[1] - c2[1]) > 0.05)) {
          combinedPath = buildCurvedPath(c1, c2).concat(buildCurvedPath(c2, c3));
        } else {
          combinedPath = buildCurvedPath(c2, c3);
        }

        setMapPath(combinedPath);
        setMapStops(previewStops);

        const roundedDist = Math.round(totalDist);
        const roundedHrs = Math.round(totalHrs * 10) / 10;
        const mpg = formData.mpgEstimate || 6.5;
        const fuelNeededGals = Math.round(totalDist / mpg);
        const fuelStops = formData.optimizeFuel ? Math.ceil(fuelNeededGals / (formData.fuelCapacity * 0.8 || 120)) : 1;

        setDistance(roundedDist);
        setHours(roundedHrs);
        setFuelNeeded(fuelNeededGals);
        setStopsCount(fuelStops);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [formData.currentLocation, formData.pickupLocation, formData.dropoffLocation, formData.mpgEstimate, formData.optimizeFuel, formData.fuelCapacity]);

  const hasRoute = !!(formData.pickupLocation && formData.dropoffLocation);
  
  const totalDrivingToday = Number((formData.currentDrivingHoursToday + hours).toFixed(1));
  const totalOnDutyToday = Number((formData.currentOnDutyHoursToday + hours + (hasRoute ? 1.5 : 0)).toFixed(1));
  const cycleRemaining = Math.max(0, Number((70 - formData.currentCycleUsed - hours).toFixed(1)));
  
  const isViolation = (totalDrivingToday > 11 || totalOnDutyToday > 14) && !formData.autoHOS;
  const isWarning = cycleRemaining < 10;
  
  let riskStatus = "Low";
  let riskColor = "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800";
  if (isViolation) {
    riskStatus = "High Violation Risk";
    riskColor = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800 animate-pulse";
  } else if (isWarning) {
    riskStatus = "Medium Warn";
    riskColor = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800";
  }

  return (
    <Card className="border-slate-200/50 shadow-xl dark:border-slate-800/50 dark:bg-slate-950/50 backdrop-blur-xl">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold">Live Route Planner Preview</CardTitle>
            <CardDescription>Real-time FMCSA compliance calculations</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={riskColor}>
              Risk: {riskStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Route Details Map Preview */}
        <div className="relative h-96 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200/30 dark:border-slate-800/30 shadow-inner">
          {hasRoute && mapPath.length > 0 ? (
            <div className="h-full w-full relative">
              <RouteMap 
                height="100%" 
                zoomLevel={4} 
                coordinates={mapPath} 
                stops={mapStops}
                distance={distance}
                duration={hours}
              />
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm p-2 rounded-lg text-xs font-bold shadow border border-slate-200/20 z-20 text-slate-800 dark:text-slate-100">
                <span className="text-slate-500">Route active:</span> {formData.pickupLocation || "Origin"} → {formData.dropoffLocation || "Destination"}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-650 p-4 text-center z-10">
              <Navigation className="h-8 w-8 mb-2 animate-bounce text-blue-500" />
              <p className="text-sm font-extrabold text-slate-700 dark:text-slate-350">Enter Pickup and Dropoff locations</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Live map preview will generate automatically</p>
            </div>
          )}
        </div>

        {/* Animated Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-slate-200/40 rounded-xl bg-slate-50/50 dark:border-slate-800/40 dark:bg-slate-900/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Drive Duration</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{hours} hrs</p>
            <p className="text-[10px] text-slate-400">At avg 55 mph</p>
          </div>

          <div className="p-4 border border-slate-200/40 rounded-xl bg-slate-50/50 dark:border-slate-800/40 dark:bg-slate-900/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Navigation className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Distance</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{distance} mi</p>
            <p className="text-[10px] text-slate-400">Total route mileage</p>
          </div>

          <div className="p-4 border border-slate-200/40 rounded-xl bg-slate-50/50 dark:border-slate-800/40 dark:bg-slate-900/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Fuel className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Fuel Stop Count</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{stopsCount} Stops</p>
            <p className="text-[10px] text-slate-400">Estimated ~{fuelNeeded} gal</p>
          </div>

          <div className="p-4 border border-slate-200/40 rounded-xl bg-slate-50/50 dark:border-slate-800/40 dark:bg-slate-900/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <ShieldAlert className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Cycle Remaining</span>
            </div>
            <p className={`text-2xl font-extrabold ${cycleRemaining < 10 ? "text-amber-500" : "text-slate-800 dark:text-slate-100"}`}>
              {cycleRemaining.toFixed(1)} hrs
            </p>
            <p className="text-[10px] text-slate-400">Out of 70h cycle limit</p>
          </div>
        </div>

        {/* Dynamic Timeline progress bars */}
        <div className="space-y-4 pt-2">
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daily Driving HOS Buffer</span>
              <span className={totalDrivingToday >= 11 ? "text-red-500" : "text-slate-800 dark:text-slate-200"}>
                {totalDrivingToday} / 11 hrs limit
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-850 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  totalDrivingToday >= 11 ? "bg-red-500" : totalDrivingToday >= 9 ? "bg-amber-500" : "bg-blue-600"
                }`}
                style={{ width: `${Math.min(100, (totalDrivingToday / 11) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daily On-Duty HOS Buffer</span>
              <span className={totalOnDutyToday >= 14 ? "text-red-500" : "text-slate-800 dark:text-slate-200"}>
                {totalOnDutyToday} / 14 hrs window
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-850 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  totalOnDutyToday >= 14 ? "bg-red-500" : totalOnDutyToday >= 12 ? "bg-amber-500" : "bg-blue-600"
                }`}
                style={{ width: `${Math.min(100, (totalOnDutyToday / 14) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* ETA Section */}
        <div className="flex items-center gap-3 p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-900/30 rounded-xl text-sm font-semibold">
          <Calendar className="h-5 w-5 text-blue-500" />
          <div className="flex-1">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Estimated Arrival (ETA)</p>
            <p className="text-slate-800 dark:text-slate-200">
              {formData.startDate ? `${formData.startDate} at ` : "Today at "}
              {formData.startTime || "08:00 AM"} (+{hours} hrs route duration)
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
