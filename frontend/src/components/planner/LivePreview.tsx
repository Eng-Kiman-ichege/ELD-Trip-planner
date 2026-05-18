import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Badge } from "../ui/badge"
import { Clock, Fuel, ShieldAlert, Navigation, Calendar } from "lucide-react"
import { RouteMap } from "../shared/RouteMap"

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

export function LivePreview({ formData }: LivePreviewProps) {
  // Simple calculated metrics based on mocked route logic
  const hasRoute = formData.pickupLocation || formData.dropoffLocation;
  
  // Custom mock distances based on typical route text
  const getRouteMetrics = () => {
    if (!hasRoute) return { distance: 0, hours: 0, fuelNeeded: 0, rests: 0, stops: 0 };
    
    let baseDistance = 350; // default
    const text = `${formData.currentLocation} ${formData.pickupLocation} ${formData.dropoffLocation}`.toLowerCase();
    
    if (text.includes("dallas") && text.includes("houston")) {
      baseDistance = 240;
    } else if (text.includes("dallas") && text.includes("miami")) {
      baseDistance = 1300;
    } else if (text.includes("houston") && text.includes("miami")) {
      baseDistance = 1180;
    } else if (text.includes("atlanta") && text.includes("orlando")) {
      baseDistance = 440;
    }

    const hours = Math.round((baseDistance / 55) * 10) / 10; // average truck speed ~55mph
    const mpg = formData.mpgEstimate || 6.5;
    const fuelNeeded = Math.round(baseDistance / mpg);
    const stops = formData.optimizeFuel ? Math.ceil(fuelNeeded / (formData.fuelCapacity * 0.8 || 120)) : 1;
    const rests = formData.includeOvernight ? Math.ceil(hours / 11) : 0;

    return { distance: baseDistance, hours, fuelNeeded, rests, stops };
  };

  const metrics = getRouteMetrics();
  const cycleRemaining = Math.max(0, 70 - formData.currentCycleUsed - metrics.hours);
  const remainingToday = Math.max(0, 11 - formData.currentDrivingHoursToday);
  
  const isViolation = metrics.hours > remainingToday && !formData.autoHOS;
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
        {/* Route Details Map Mockup */}
        <div className="relative h-48 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200/30 dark:border-slate-800/30">
          {hasRoute ? (
            <div className="h-full w-full relative">
              <RouteMap height="100%" zoomLevel={4} />
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm p-2 rounded-lg text-xs font-bold shadow border border-slate-200/20 z-20">
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
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{metrics.hours} hrs</p>
            <p className="text-[10px] text-slate-400">At avg 55 mph</p>
          </div>

          <div className="p-4 border border-slate-200/40 rounded-xl bg-slate-50/50 dark:border-slate-800/40 dark:bg-slate-900/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Navigation className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Distance</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{metrics.distance} mi</p>
            <p className="text-[10px] text-slate-400">Total route mileage</p>
          </div>

          <div className="p-4 border border-slate-200/40 rounded-xl bg-slate-50/50 dark:border-slate-800/40 dark:bg-slate-900/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Fuel className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Fuel Stop Count</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{metrics.stops} Stops</p>
            <p className="text-[10px] text-slate-400">Estimated ~{metrics.fuelNeeded} gal</p>
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
              <span className={formData.currentDrivingHoursToday >= 11 ? "text-red-500" : "text-slate-800 dark:text-slate-200"}>
                {formData.currentDrivingHoursToday} / 11 hrs limit
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-850 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  formData.currentDrivingHoursToday >= 11 ? "bg-red-500" : formData.currentDrivingHoursToday >= 9 ? "bg-amber-500" : "bg-blue-600"
                }`}
                style={{ width: `${Math.min(100, (formData.currentDrivingHoursToday / 11) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daily On-Duty HOS Buffer</span>
              <span className={formData.currentOnDutyHoursToday >= 14 ? "text-red-500" : "text-slate-800 dark:text-slate-200"}>
                {formData.currentOnDutyHoursToday} / 14 hrs window
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-850 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  formData.currentOnDutyHoursToday >= 14 ? "bg-red-500" : formData.currentOnDutyHoursToday >= 12 ? "bg-amber-500" : "bg-blue-600"
                }`}
                style={{ width: `${Math.min(100, (formData.currentOnDutyHoursToday / 14) * 100)}%` }}
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
              {formData.startTime || "08:00 AM"} (+{metrics.hours} hrs route duration)
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
