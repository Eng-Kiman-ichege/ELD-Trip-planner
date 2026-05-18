import { useState } from "react"
import { motion } from "framer-motion"
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Fuel, Coffee, Bed, ArrowRight, ShieldCheck } from "lucide-react"
import { Card } from "../ui/card"

export interface MapStop {
  id: string;
  name: string;
  type: "pickup" | "dropoff" | "fuel" | "rest" | "sleep";
  x: number; // canvas percent X
  y: number; // canvas percent Y
  time: string;
  duration?: string;
  details: string;
}

const defaultStops: MapStop[] = [
  { id: "1", name: "Dallas Terminal", type: "pickup", x: 15, y: 70, time: "Day 1, 08:00 AM", details: "Initial cargo loading and pre-trip HOS audit." },
  { id: "2", name: "Loves Fuel #48", type: "fuel", x: 32, y: 62, time: "Day 1, 12:30 PM", duration: "30 min", details: "Fueling and mid-trip walkaround inspection." },
  { id: "3", name: "Birmingham Pilot", type: "rest", x: 50, y: 50, time: "Day 1, 04:30 PM", duration: "1 hr", details: "Mandatory rest break and cycle assessment." },
  { id: "4", name: "Atlanta Rest Center", type: "sleep", x: 68, y: 45, time: "Day 1, 08:00 PM", duration: "10 hrs", details: "Mandatory sleeper berth overnight rest." },
  { id: "5", name: "Orlando Terminal", type: "rest", x: 82, y: 68, time: "Day 2, 09:30 AM", duration: "45 min", details: "Trailer connection inspection." },
  { id: "6", name: "Miami Port Dropoff", type: "dropoff", x: 92, y: 88, time: "Day 2, 02:00 PM", details: "Cargo discharge and post-trip HOS log submission." }
]

export function InteractiveRouteMap() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [hoveredStop, setHoveredStop] = useState<MapStop | null>(null)
  const [selectedStop, setSelectedStop] = useState<MapStop | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75))
  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSelectedStop(null)
  }

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => setIsDragging(false)

  const getStopIcon = (type: MapStop["type"]) => {
    switch (type) {
      case "pickup":
        return <MapPin className="h-4.5 w-4.5 text-blue-500" />
      case "dropoff":
        return <MapPin className="h-4.5 w-4.5 text-red-500" />
      case "fuel":
        return <Fuel className="h-4.5 w-4.5 text-amber-500" />
      case "rest":
        return <Coffee className="h-4.5 w-4.5 text-emerald-500" />
      case "sleep":
        return <Bed className="h-4.5 w-4.5 text-indigo-500" />
    }
  }

  return (
    <Card className="relative h-[580px] w-full border-slate-200/50 dark:border-slate-800/50 bg-slate-900 overflow-hidden shadow-2xl rounded-2xl select-none group">
      
      {/* Dynamic Background Map Coordinate Plane */}
      <div 
        className="absolute inset-0 cursor-grab active:cursor-grabbing opacity-20 pointer-events-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.2s ease-out"
        }}
      ></div>

      {/* Stylized Southeastern US State Outlines Mock */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center transition-all"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.2s ease-out"
        }}
      >
        <svg className="w-full h-full min-w-[600px] opacity-15" viewBox="0 0 100 100">
          {/* Mock coastline vector path */}
          <path 
            d="M 5,60 Q 20,40 35,45 T 60,35 T 80,48 T 90,80 T 95,95" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="2" 
            strokeDasharray="4 4"
          />
          <path 
            d="M 30,5 Q 45,25 55,15 T 75,30 T 90,20" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="1.5" 
            strokeDasharray="2 2"
          />
        </svg>
      </div>

      {/* Active Route Path Layer */}
      <div
        className="absolute inset-0 pointer-events-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.2s ease-out"
        }}
      >
        <svg className="w-full h-full min-w-[600px]" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Glow backdrop line */}
          <path
            d="M 15,70 Q 32,62 50,50 T 68,45 T 82,68 T 92,88"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3.5"
            className="opacity-30 blur-[2px]"
          />
          {/* Main animated route line */}
          <motion.path
            d="M 15,70 Q 32,62 50,50 T 68,45 T 82,68 T 92,88"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="4 2"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          />

          {/* Active transit truck simulator */}
          <motion.circle
            r="1.2"
            className="fill-blue-400 stroke-blue-500 stroke-[0.3]"
            animate={{
              cx: [15, 32, 50, 68, 82, 92],
              cy: [70, 62, 50, 45, 68, 88]
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut"
            }}
          />
        </svg>

        {/* Dynamic Stops Pins */}
        {defaultStops.map((stop) => (
          <div
            key={stop.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/pin"
            style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
            onMouseEnter={() => setHoveredStop(stop)}
            onMouseLeave={() => setHoveredStop(null)}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedStop(stop)
            }}
          >
            <div className={`flex items-center justify-center h-8 w-8 rounded-full border border-slate-700 bg-slate-950 shadow-lg transition-all duration-300 ${
              selectedStop?.id === stop.id ? "scale-125 ring-2 ring-blue-500 bg-blue-950/80 border-blue-400" : "hover:scale-115 hover:border-slate-500"
            }`}>
              {getStopIcon(stop.type)}
            </div>
            
            {/* Pulsing indicator for active transit stop */}
            {stop.type === "pickup" && (
              <span className="absolute -inset-0.5 rounded-full bg-blue-500 opacity-20 animate-ping"></span>
            )}
          </div>
        ))}
      </div>

      {/* Floating Control Bar (Top Left) */}
      <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
        <button 
          onClick={handleZoomIn}
          className="h-10 w-10 bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white rounded-lg flex items-center justify-center backdrop-blur-md transition shadow cursor-pointer focus:outline-none"
          title="Zoom In"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="h-10 w-10 bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white rounded-lg flex items-center justify-center backdrop-blur-md transition shadow cursor-pointer focus:outline-none"
          title="Zoom Out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button 
          onClick={handleReset}
          className="h-10 w-10 bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white rounded-lg flex items-center justify-center backdrop-blur-md transition shadow cursor-pointer focus:outline-none"
          title="Reset View"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      {/* Floating Route Statistics Summary Card (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-30 bg-slate-950/90 border border-slate-800/80 p-4 rounded-xl max-w-[240px] shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2 text-blue-400">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">HOS Compliant Path</span>
        </div>
        <p className="text-sm font-extrabold text-white">Dallas to Miami Port</p>
        <div className="mt-2 space-y-1 text-slate-400 text-xs font-semibold">
          <div className="flex justify-between">
            <span>Distance:</span>
            <span className="text-white">1,180 mi</span>
          </div>
          <div className="flex justify-between">
            <span>Drive Time:</span>
            <span className="text-white">21.5 hrs</span>
          </div>
          <div className="flex justify-between">
            <span>Required Breaks:</span>
            <span className="text-white">3 Rest / 1 Sleep</span>
          </div>
        </div>
      </div>

      {/* Tooltip Overlay (Top Right / Center) */}
      {(hoveredStop || selectedStop) && (
        <div className="absolute top-4 right-4 z-30 max-w-[280px] bg-slate-950/95 border border-slate-800/80 p-4 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          {(() => {
            const stop = hoveredStop || selectedStop;
            if (!stop) return null;
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    {getStopIcon(stop.type)}
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{stop.type}</span>
                  </div>
                  {stop.duration && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800/50">
                      {stop.duration}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-extrabold text-white">{stop.name}</h4>
                <p className="text-[10px] text-blue-400 font-bold">{stop.time}</p>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">{stop.details}</p>
                {selectedStop && (
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button 
                      onClick={() => setSelectedStop(null)} 
                      className="text-[10px] font-bold text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer focus:outline-none"
                    >
                      Dismiss <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* Drag helper indicator */}
      <div className="absolute bottom-4 right-4 z-30 text-[10px] font-bold text-slate-500 bg-slate-950/50 px-2 py-1 rounded border border-slate-800/50">
        🖱️ Drag to pan • Scroll to zoom
      </div>

    </Card>
  )
}
