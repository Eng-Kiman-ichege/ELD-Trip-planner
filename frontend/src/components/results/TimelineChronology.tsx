import { motion } from "framer-motion"
import { Fuel, Coffee, Bed, MapPin, Truck, HelpCircle } from "lucide-react"

export interface ChronoStop {
  type: "pickup" | "fuel" | "rest" | "sleep" | "dropoff";
  location: string;
  arrival: string;
  departure: string;
  duration: string;
  status: "ON Duty" | "Driving" | "OFF Duty" | "Sleeper Berth";
  mile: number;
}

const timelineData: ChronoStop[] = [
  { type: "pickup", location: "Dallas Terminal - Warehouse 4", arrival: "Day 1, 08:00 AM", departure: "Day 1, 09:30 AM", duration: "1.5 hrs", status: "ON Duty", mile: 0 },
  { type: "fuel", location: "Loves Travel Stop #48 - Lindale, TX", arrival: "Day 1, 12:30 PM", departure: "Day 1, 01:00 PM", duration: "30 min", status: "ON Duty", mile: 240 },
  { type: "rest", location: "Pilot Travel Center - Meridian, MS", arrival: "Day 1, 04:30 PM", departure: "Day 1, 05:30 PM", duration: "1 hr", status: "OFF Duty", mile: 480 },
  { type: "sleep", location: "Atlanta Rest Oasis - Sleeper Berth Zone", arrival: "Day 1, 08:00 PM", departure: "Day 2, 06:00 AM", duration: "10 hrs", status: "Sleeper Berth", mile: 720 },
  { type: "rest", location: "Orlando Logistics Depot", arrival: "Day 2, 09:30 AM", departure: "Day 2, 10:15 AM", duration: "45 min", status: "ON Duty", mile: 980 },
  { type: "dropoff", location: "Miami Cargo Discharge - Port Terminal B", arrival: "Day 2, 02:00 PM", departure: "Day 2, 03:30 PM", duration: "1.5 hrs", status: "ON Duty", mile: 1180 }
]

export function TimelineChronology() {
  const getIcon = (type: ChronoStop["type"]) => {
    switch (type) {
      case "pickup":
      case "dropoff":
        return <MapPin className="h-5 w-5" />
      case "fuel":
        return <Fuel className="h-5 w-5" />
      case "rest":
        return <Coffee className="h-5 w-5" />
      case "sleep":
        return <Bed className="h-5 w-5" />
      default:
        return <HelpCircle className="h-5 w-5" />
    }
  }

  const getColor = (type: ChronoStop["type"]) => {
    switch (type) {
      case "pickup":
        return "bg-blue-500 border-blue-200 dark:border-blue-800 text-white"
      case "dropoff":
        return "bg-red-500 border-red-200 dark:border-red-800 text-white"
      case "fuel":
        return "bg-amber-500 border-amber-200 dark:border-amber-800 text-white"
      case "rest":
        return "bg-emerald-500 border-emerald-200 dark:border-emerald-800 text-white"
      case "sleep":
        return "bg-indigo-500 border-indigo-200 dark:border-indigo-800 text-white"
    }
  }

  const getDutyColor = (status: ChronoStop["status"]) => {
    switch (status) {
      case "Driving":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-850"
      case "ON Duty":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-850"
      case "OFF Duty":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-850"
      case "Sleeper Berth":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-850"
    }
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12 px-4 select-none">
      
      {/* Dynamic connecting vertical track */}
      <div className="absolute left-8 sm:left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2"></div>
      
      <div className="space-y-12">
        {timelineData.map((stop, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <div 
              key={idx} 
              className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                isLeft ? "sm:flex-row-reverse" : ""
              }`}
            >
              
              {/* Connecting point dot */}
              <div className="absolute left-8 sm:left-1/2 top-6 sm:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className={`h-12 w-12 rounded-full border shadow-xl flex items-center justify-center transition-transform hover:scale-110 ${getColor(stop.type)}`}>
                  {getIcon(stop.type)}
                </div>
              </div>

              {/* Chronological Stop Card details */}
              <div className={`w-full sm:w-[45%] pl-16 sm:pl-0 ${
                isLeft ? "sm:pr-12" : "sm:pl-12"
              }`}>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="p-5 bg-white/70 border border-slate-200/50 rounded-2xl shadow-md hover:shadow-xl transition dark:bg-slate-950/70 dark:border-slate-800/50 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Stop {idx + 1} • {stop.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDutyColor(stop.status)}`}>
                      {stop.status}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                    {stop.location}
                  </h4>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-850 text-xs font-semibold">
                    <div>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Arrival</p>
                      <p className="text-slate-700 dark:text-slate-350">{stop.arrival}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Departure</p>
                      <p className="text-slate-700 dark:text-slate-350">{stop.departure}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Duration</p>
                      <p className="text-slate-700 dark:text-slate-350">{stop.duration}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase">Odometer</p>
                      <p className="text-blue-500 dark:text-blue-450">{stop.mile > 0 ? `${stop.mile} mi` : "Start"}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Spacer on desktop */}
              <div className="hidden sm:block sm:w-[45%]"></div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
