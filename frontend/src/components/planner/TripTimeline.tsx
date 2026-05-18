import { Fuel, Coffee, Bed, MapPin } from "lucide-react"

export interface Stop {
  name: string;
  type: "start" | "fuel" | "rest" | "sleep" | "end";
  mile: number;
}

interface TripTimelineProps {
  stops: Stop[];
}

export function TripTimeline({ stops }: TripTimelineProps) {
  const getIcon = (type: Stop["type"]) => {
    switch (type) {
      case "start":
      case "end":
        return <MapPin className="h-4 w-4" />
      case "fuel":
        return <Fuel className="h-4 w-4" />
      case "rest":
        return <Coffee className="h-4 w-4" />
      case "sleep":
        return <Bed className="h-4 w-4" />
    }
  }

  const getColor = (type: Stop["type"]) => {
    switch (type) {
      case "start":
        return "bg-blue-500 text-white"
      case "end":
        return "bg-red-500 text-white"
      case "fuel":
        return "bg-amber-500 text-white"
      case "rest":
        return "bg-emerald-500 text-white"
      case "sleep":
        return "bg-indigo-500 text-white"
    }
  }

  return (
    <div className="relative w-full py-8 overflow-x-auto select-none">
      {/* Connecting line */}
      <div className="absolute top-[52px] left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-800 min-w-[600px]"></div>

      <div className="flex justify-between items-center gap-12 px-2 min-w-[600px]">
        {stops.map((stop, idx) => (
          <div key={idx} className="relative flex flex-col items-center gap-3 flex-1">
            
            {/* Step bubble */}
            <div className={`z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-md ${getColor(stop.type)}`}>
              {getIcon(stop.type)}
            </div>

            {/* Stop labels */}
            <div className="text-center">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {stop.name}
              </p>
              <p className="text-[10px] font-medium text-slate-400">
                {stop.mile > 0 ? `Mi ${stop.mile}` : "Start"}
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
