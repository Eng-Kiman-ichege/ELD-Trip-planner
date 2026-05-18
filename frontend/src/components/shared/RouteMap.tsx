import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { ShieldCheck, Sparkles } from "lucide-react"

// Coordinate definitions for our realistic trucking route: Dallas -> Lindale (Loves) -> Meridian (Pilot) -> Atlanta -> Orlando -> Miami
export interface StopCoordinate {
  id: string;
  name: string;
  type: "pickup" | "dropoff" | "fuel" | "rest" | "sleep";
  coords: [number, number]; // [lat, lng]
  time: string;
  details: string;
}

export const routeStops: StopCoordinate[] = [
  { id: "1", name: "Dallas Terminal", type: "pickup", coords: [32.7767, -96.7970], time: "Day 1, 08:00 AM", details: "Initial cargo loading and pre-trip HOS audit." },
  { id: "2", name: "Loves Fuel Stop #48", type: "fuel", coords: [32.5151, -95.2902], time: "Day 1, 12:30 PM", details: "Fueling and mid-trip walkaround inspection." },
  { id: "3", name: "Meridian Pilot", type: "rest", coords: [32.3643, -88.7037], time: "Day 1, 04:30 PM", details: "Mandatory rest break and cycle assessment." },
  { id: "4", name: "Atlanta Rest Oasis", type: "sleep", coords: [33.7490, -84.3880], time: "Day 1, 08:00 PM", details: "Mandatory sleeper berth overnight rest." },
  { id: "5", name: "Orlando Logistics Depot", type: "rest", coords: [28.5383, -81.3792], time: "Day 2, 09:30 AM", details: "Trailer connection inspection." },
  { id: "6", name: "Miami Cargo Discharge", type: "dropoff", coords: [25.7617, -80.1918], time: "Day 2, 02:00 PM", details: "Cargo discharge and post-trip HOS log submission." }
]

// Pure polyline path tracing the interstate lines
const routePath: [number, number][] = routeStops.map(s => s.coords)

// Reusable SVG Leaflet Markers to bypass broken local image issues in Vite and support Dark/Light modes instantly
const getMarkerIcon = (type: StopCoordinate["type"]) => {
  let color = "#3b82f6" // blue
  let iconHtml = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`

  if (type === "dropoff") {
    color = "#ef4444" // red
    iconHtml = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
  } else if (type === "fuel") {
    color = "#f59e0b" // amber
    iconHtml = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="M3 22v-20h14v20"></path><path d="M9 12h4"></path><path d="M17 6h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4"></path></svg>`
  } else if (type === "rest") {
    color = "#10b981" // emerald
    iconHtml = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`
  } else if (type === "sleep") {
    color = "#6366f1" // indigo
    iconHtml = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9M10 8c1.33 0 4 1.33 4 4v5M18 10v7"></path></svg>`
  }

  return L.divIcon({
    html: `<div style="background-color: #0f172a; border: 2px solid ${color}; border-radius: 9999px; height: 32px; width: 32px; display: flex; items-center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); padding: 6px;">${iconHtml}</div>`,
    className: "custom-div-leaflet-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
}

interface RouteMapProps {
  height?: string;
  zoomLevel?: number;
  coordinates?: [number, number][];
  stops?: StopCoordinate[];
}

export function RouteMap({ height = "480px", zoomLevel = 5, coordinates, stops }: RouteMapProps) {
  const activeStops = stops || routeStops
  const routePath = coordinates || activeStops.map(s => s.coords)
  const centerCoords: [number, number] = activeStops[0]?.coords || [30.5000, -88.5000]

  return (
    <div className="relative border border-slate-200/60 dark:border-slate-800/60 bg-slate-100 rounded-2xl overflow-hidden shadow-xl" style={{ height }}>
      
      {/* React Leaflet Map container */}
      <MapContainer 
        center={centerCoords} 
        zoom={zoomLevel} 
        zoomControl={true}
        style={{ height: "100%", width: "100%", zIndex: 10 }}
        key={centerCoords.toString()} // Force refresh when route changes
      >
        {/* OpenStreetMap Standard Tiles Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tile-layer" // Hook for CSS dark mode filter styling
        />

        {/* Compliant polyline connector path */}
        <Polyline 
          positions={routePath} 
          pathOptions={{ color: "#3b82f6", weight: 4, dashArray: "5, 8", lineCap: "round" }} 
        />

        {/* Dynamic Stops Markers */}
        {activeStops.map((stop) => (
          <Marker
            key={stop.id}
            position={stop.coords}
            icon={getMarkerIcon(stop.type)}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-3 w-56 space-y-1 font-sans text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-1.5 mb-1.5">
                  <span className="font-extrabold uppercase text-[9px] text-blue-500 dark:text-blue-400">
                    {stop.type} Stop
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold">{stop.time}</span>
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 leading-snug">{stop.name}</h4>
                <p className="text-slate-500 dark:text-slate-400 leading-normal">{stop.details}</p>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* Floating Route Statistics Overlay (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 border border-slate-800/80 p-4 rounded-xl max-w-[240px] shadow-2xl backdrop-blur-md text-white">
        <div className="flex items-center gap-1.5 mb-2 text-blue-400">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">HOS Compliant Routing</span>
        </div>
        <p className="text-sm font-extrabold">
          {activeStops[0]?.name.split(' ')[0]} ➔ {activeStops[activeStops.length - 1]?.name.split(' ')[0]}
        </p>
        <div className="mt-2 space-y-1 text-slate-400 text-[11px] font-semibold">
          <div className="flex justify-between">
            <span>Distance:</span>
            <span className="text-white">{routePath.length > 0 ? "Dynamic Path" : "1,180 mi"}</span>
          </div>
          <div className="flex justify-between">
            <span>Stops count:</span>
            <span className="text-white">{activeStops.length} stops</span>
          </div>
        </div>
      </div>

      {/* Floating Sparkles indicator (Top Right) */}
      <div className="absolute top-4 right-4 z-20 bg-blue-600/90 border border-blue-500/50 p-2 py-1.5 rounded-lg flex items-center gap-1.5 shadow backdrop-blur-md text-white text-[10px] font-bold">
        <Sparkles className="h-3.5 w-3.5" />
        AI Optimized Stops
      </div>

    </div>
  )
}
