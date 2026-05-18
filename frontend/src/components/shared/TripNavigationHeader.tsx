import { useNavigate } from "react-router-dom"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { 
  BarChart4, Route, Calendar, ArrowLeft, ShieldCheck, 
  MapPin, Clock, Navigation 
} from "lucide-react"

interface TripNavigationHeaderProps {
  tripId: string | number;
  activeTab: "results" | "stops" | "logs";
  trip?: any;
}

export function TripNavigationHeader({ tripId, activeTab, trip }: TripNavigationHeaderProps) {
  const navigate = useNavigate()

  // Format dynamic route text if trip is loaded
  const origin = trip?.pickup_location?.split(",")[0] || trip?.current_location?.split(",")[0] || "Origin"
  const destination = trip?.dropoff_location?.split(",")[0] || "Destination"
  const miles = trip?.total_distance ? `${Math.round(trip.total_distance)} mi` : ""
  const hours = trip?.total_duration ? `${Math.round(trip.total_duration)} hrs` : ""

  const tabs = [
    {
      id: "results",
      label: "Results Dashboard",
      icon: <BarChart4 className="h-4 w-4" />,
      path: `/trip/${tripId}`
    },
    {
      id: "stops",
      label: "Stops Timeline",
      icon: <Route className="h-4 w-4" />,
      path: `/trip/${tripId}/stops`
    },
    {
      id: "logs",
      label: "ELD Compliance Logs",
      icon: <Calendar className="h-4 w-4" />,
      path: `/trip/${tripId}/logs`
    }
  ]

  return (
    <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow-lg backdrop-blur-md space-y-5 transition-colors duration-300">
      
      {/* 1. Header Information Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="h-8 px-3 rounded-lg border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer focus:outline-none"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Button>
          
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Badge className="bg-blue-600 text-white font-extrabold text-[10px] tracking-wide rounded-md px-2.5 h-6">
              TRIP-{tripId}
            </Badge>
            {trip && (
              <h2 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 leading-none">
                <span className="text-slate-500 dark:text-slate-400 font-bold">{origin}</span>
                <span className="text-blue-500 font-extrabold text-xs">➔</span>
                <span className="text-slate-850 dark:text-slate-200">{destination}</span>
              </h2>
            )}
          </div>
        </div>

        {/* Dynamic Badges / Metadata */}
        {trip && (
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-slate-450 dark:text-slate-400">
            <span className="flex items-center gap-1 bg-slate-100/60 dark:bg-slate-900/60 px-2.5 py-1 rounded-md">
              <MapPin className="h-3 w-3 text-blue-500" /> {miles}
            </span>
            <span className="flex items-center gap-1 bg-slate-100/60 dark:bg-slate-900/60 px-2.5 py-1 rounded-md">
              <Clock className="h-3 w-3 text-indigo-500" /> {hours}
            </span>
            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/25">
              <ShieldCheck className="h-3 w-3 text-emerald-500" /> 100% Compliant
            </span>
          </div>
        )}
      </div>

      {/* 2. Interactive Navigation Tabs Row */}
      <div className="flex flex-col sm:flex-row gap-2 border-t border-slate-100 dark:border-slate-850 pt-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <Button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`h-9 px-4 text-xs font-extrabold rounded-xl flex items-center gap-2 cursor-pointer transition-all duration-200 ${
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/15 hover:bg-blue-700 scale-[1.02]" 
                  : "bg-transparent border border-slate-200/50 hover:bg-slate-100 text-slate-550 hover:text-slate-800 dark:border-slate-800/50 dark:hover:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </Button>
          )
        })}
      </div>

    </Card>
  )
}
