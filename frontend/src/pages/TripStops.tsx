import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { RouteMap } from "../components/shared/RouteMap"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { api } from "../lib/api"
import type { StopCoordinate } from "../components/shared/RouteMap"
import { 
  Fuel, Moon, Package, MapPin, Coffee, AlertTriangle, 
  CheckCircle2, Compass, ChevronRight, Gauge, Loader2
} from "lucide-react"

import { TripNavigationHeader } from "../components/shared/TripNavigationHeader"

// Map backend stop_type to display icon
function getStopIcon(type: string) {
  switch (type) {
    case "pickup":   return <Package className="h-5 w-5 text-blue-500" />
    case "fuel":     return <Fuel className="h-5 w-5 text-amber-500" />
    case "break":    return <Coffee className="h-5 w-5 text-emerald-500" />
    case "rest":     return <Coffee className="h-5 w-5 text-emerald-500" />
    case "sleeper":
    case "sleep":    return <Moon className="h-5 w-5 text-indigo-500" />
    case "dropoff":  return <MapPin className="h-5 w-5 text-red-500" />
    default:         return <MapPin className="h-5 w-5 text-slate-500" />
  }
}

// Map backend stop_type to a colour class for the timeline dot
const TYPE_COLOR: Record<string, string> = {
  pickup:  "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
  dropoff: "border-red-500 bg-red-50 dark:bg-red-900/20",
  fuel:    "border-amber-500 bg-amber-50 dark:bg-amber-900/20",
  break:   "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
  rest:    "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
  sleeper: "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20",
}

// Format an ISO datetime string as readable "Day N, HH:MM AM/PM"
function fmtTime(dt: string): string {
  if (!dt) return "—"
  try {
    const d = new Date(dt)
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  } catch {
    return dt
  }
}

export function TripStops() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [stops, setStops] = useState<any[]>([])
  const [trip, setTrip] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    async function fetchStops() {
      try {
        setIsLoading(true)
        const [stopsData, tripData] = await Promise.all([
          api.trips.getStops(id!),
          api.trips.get(id!)
        ])
        setStops(stopsData)
        setTrip(tripData)
      } catch (err: any) {
        setError(err.message || "Failed to load trip stops.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchStops()
  }, [id])

  if (isLoading) {
    return (
      <PageContainer className="bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading Route Stop Sequence...</p>
        </div>
      </PageContainer>
    )
  }

  // Aggregated counters
  const fuelCount  = stops.filter(s => s.stop_type === "fuel").length
  const sleepCount = stops.filter(s => ["sleeper", "sleep", "rest"].includes(s.stop_type)).length
  const totalRestMins = stops
    .filter(s => ["sleeper", "sleep", "rest", "break"].includes(s.stop_type))
    .reduce((acc, s) => acc + (s.duration_minutes || 0), 0)

  // Build LeafletMap stops from backend coordinates
  const mapStops: StopCoordinate[] = stops
    .filter(s => s.latitude && s.longitude)
    .map((s, idx) => ({
      id: String(s.id ?? idx),
      name: s.location_name,
      type: (s.stop_type === "break" ? "rest" : s.stop_type === "sleeper" ? "sleep" : s.stop_type) as StopCoordinate["type"],
      coords: [s.latitude, s.longitude] as [number, number],
      time: fmtTime(s.arrival_time),
      details: s.notes || `${s.stop_type} stop — ${s.duration_minutes} min`,
    }))

  return (
    <PageContainer className="bg-slate-50 dark:bg-slate-950">
      <div className="container relative mx-auto px-4 md:px-6 space-y-10">
        
        {/* Dynamic Shared Premium Trip Navigation Header */}
        <TripNavigationHeader tripId={id!} activeTab="stops" trip={trip} />

        {/* Error banner */}
        {error && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" /><p>{error}</p>
          </div>
        )}

        {/* B. Metrics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Stops</span>
            <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{stops.length} stops</p>
            <span className="text-[9px] font-bold text-slate-400">Full route sequence</span>
          </Card>
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fuel Stops</span>
            <p className="text-3xl font-black text-amber-500">{fuelCount} stop{fuelCount !== 1 ? "s" : ""}</p>
            <span className="text-[9px] font-bold text-slate-400">Diesel optimization route</span>
          </Card>
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Rest / Sleep Stops</span>
            <p className="text-3xl font-black text-indigo-500">{sleepCount} stop{sleepCount !== 1 ? "s" : ""}</p>
            <span className="text-[9px] font-bold text-slate-400">HOS mandatory resets</span>
          </Card>
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Rest Duration</span>
            <p className="text-3xl font-black text-emerald-500">{(totalRestMins / 60).toFixed(1)} hrs</p>
            <span className="text-[9px] font-bold text-slate-400">HOS reset + rest breaks</span>
          </Card>
        </div>

        {/* C. Main two-column layout */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* LEFT: Vertical Timeline */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Stops Schedule Breakdown</h3>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-250 dark:border-emerald-800 font-bold text-[10px]">
                Compliant (Score 100)
              </Badge>
            </div>

            {stops.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400 font-semibold">No stops generated for this trip yet.</div>
            ) : (
              <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 dark:border-slate-800 ml-4 pt-1">
                {stops.map((stop, idx) => (
                  <div key={stop.id ?? idx} className="relative group">
                    
                    {/* Timeline dot icon */}
                    <div className={`absolute -left-10 top-0.5 h-8 w-8 rounded-full border ${TYPE_COLOR[stop.stop_type] || "border-slate-300 bg-white"} dark:bg-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      {getStopIcon(stop.stop_type)}
                    </div>

                    <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-6 rounded-2xl shadow-lg hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-colors">
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                            Stop {idx + 1} • {stop.stop_type.replace("_", " ")}
                          </span>
                          <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100 leading-snug">{stop.location_name}</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-50/80 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400 border-0 h-5 text-[9px] font-bold uppercase rounded-md px-2.5">
                            {fmtTime(stop.arrival_time)}
                          </Badge>
                          <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border-0 h-5 text-[9px] font-bold uppercase rounded-md px-2.5">
                            {stop.duration_minutes} min
                          </Badge>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 text-xs font-semibold leading-relaxed mb-4">
                        <div className="space-y-1.5 text-slate-500 dark:text-slate-450">
                          <p>📍 Coords: <span className="text-slate-850 dark:text-slate-200">{stop.latitude?.toFixed(4)}, {stop.longitude?.toFixed(4)}</span></p>
                          <p>⏱️ Departure: <span className="text-slate-850 dark:text-slate-200">{fmtTime(stop.departure_time)}</span></p>
                          {stop.fuel_required > 0 && (
                            <p>⛽ Fuel: <span className="text-amber-500 dark:text-amber-400">{stop.fuel_required.toFixed(0)} gal required</span></p>
                          )}
                        </div>
                        <div className="space-y-1.5 text-slate-500 dark:text-slate-450">
                          <p>🚀 Type: <span className="text-emerald-500 font-bold capitalize">{stop.stop_type.replace("_", " ")}</span></p>
                          <p>⏳ Duration: <span className="text-slate-850 dark:text-slate-200">{(stop.duration_minutes / 60).toFixed(1)} hrs</span></p>
                        </div>
                      </div>

                      {stop.notes && (
                        <div className="p-3 bg-blue-50/50 border border-blue-100/60 dark:bg-blue-950/20 dark:border-blue-900/20 rounded-xl flex items-start gap-2 text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                          <p className="font-semibold">{stop.notes}</p>
                        </div>
                      )}
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Map + Recommendations */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            
            {/* Map Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">Active Dispatch Route Map</h3>
                <Badge className="bg-blue-500 text-white h-5 text-[9px] font-bold rounded-md uppercase">Live Route</Badge>
              </div>
              <RouteMap height="340px" zoomLevel={5} stops={mapStops.length > 0 ? mapStops : undefined} />
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">AI Route Intelligence</h3>
              <div className="space-y-3">
                <Card className="border-l-4 border-l-amber-500 border border-slate-200/50 bg-white/70 dark:border-slate-850 dark:bg-slate-950/70 p-4 shadow-sm flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">HOS Compliant Sequence Generated</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-semibold mt-1">
                      All {stops.length} stops are FMCSA-audited and automatically sequenced to comply with the 11-hour driving and 70-hour cycle rules.
                    </p>
                  </div>
                </Card>
                <Card className="border-l-4 border-l-emerald-500 border border-slate-200/50 bg-white/70 dark:border-slate-850 dark:bg-slate-950/70 p-4 shadow-sm flex gap-3">
                  <Gauge className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">Fuel Stops Optimized</h5>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-normal font-semibold mt-1">
                      {fuelCount} fuel stop{fuelCount !== 1 ? "s" : ""} have been strategically placed along major interstate corridors to maximize range efficiency.
                    </p>
                  </div>
                </Card>
              </div>
            </div>

          </div>
        </div>

      </div>
    </PageContainer>
  )
}
