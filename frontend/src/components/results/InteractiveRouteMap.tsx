import { ShieldCheck, Sparkles } from "lucide-react"
import { Card } from "../ui/card"
import { RouteMap } from "../shared/RouteMap"

export function InteractiveRouteMap() {
  return (
    <Card className="relative h-[580px] w-full border-slate-200/50 dark:border-slate-800/50 bg-slate-900 overflow-hidden shadow-2xl rounded-2xl select-none group">
      {/* Real interactive OpenStreetMap Tile Layer component */}
      <RouteMap height="100%" zoomLevel={5} />

      {/* Floating Route Statistics Summary Card (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 border border-slate-800/80 p-4 rounded-xl max-w-[260px] shadow-2xl backdrop-blur-md">
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

      {/* Floating Sparkles indicator (Top Right) */}
      <div className="absolute top-4 right-4 z-20 bg-blue-600/90 border border-blue-500/50 p-2 py-1.5 rounded-lg flex items-center gap-1.5 shadow backdrop-blur-md text-white text-[10px] font-bold">
        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
        AI Optimized Stops
      </div>

      {/* Drag helper indicator */}
      <div className="absolute bottom-4 right-4 z-20 text-[10px] font-bold text-slate-350 bg-slate-950/80 px-2 py-1 rounded border border-slate-800/50 shadow-md backdrop-blur-sm">
        🖱️ Drag to pan • Scroll to zoom
      </div>
    </Card>
  )
}
