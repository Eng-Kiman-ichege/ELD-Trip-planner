import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Clock, Fuel, ShieldCheck, Coffee } from "lucide-react"

export interface DutyChange {
  time: string;
  status: "OFF Duty" | "Sleeper Berth" | "Driving" | "ON Duty";
  duration: string;
  notes: string;
}

export interface DayBreakdown {
  day: number;
  date: string;
  miles: number;
  driveTime: string;
  onDutyTime: string;
  fuelStops: number;
  restBreaks: number;
  overnightSleeper: boolean;
  changes: DutyChange[];
}

const mockDays: DayBreakdown[] = [
  {
    day: 1,
    date: "May 18, 2026",
    miles: 720,
    driveTime: "8.5 hrs",
    onDutyTime: "11.0 hrs",
    fuelStops: 1,
    restBreaks: 2,
    overnightSleeper: true,
    changes: [
      { time: "08:00 AM", status: "ON Duty", duration: "1.5 hrs", notes: "Pre-trip cargo loading and inspection" },
      { time: "09:30 AM", status: "Driving", duration: "3.0 hrs", notes: "Transit from Dallas terminal east" },
      { time: "12:30 PM", status: "ON Duty", duration: "30 min", notes: "Fuel stop and trailer coupling verification" },
      { time: "01:00 PM", status: "Driving", duration: "3.5 hrs", notes: "Transit crossing Louisiana boundary" },
      { time: "04:30 PM", status: "OFF Duty", duration: "1.0 hr", notes: "Mandatory 30-min break + dinner stop" },
      { time: "05:30 PM", status: "Driving", duration: "2.0 hrs", notes: "Final Day 1 driving sprint to Atlanta" },
      { time: "07:30 PM", status: "ON Duty", duration: "30 min", notes: "Post-trip checkup and overnight berth checkin" },
      { time: "08:00 PM", status: "Sleeper Berth", duration: "10.0 hrs", notes: "Mandatory overnight HOS cycle reset" }
    ]
  },
  {
    day: 2,
    date: "May 19, 2026",
    miles: 460,
    driveTime: "7.0 hrs",
    onDutyTime: "9.0 hrs",
    fuelStops: 0,
    restBreaks: 1,
    overnightSleeper: false,
    changes: [
      { time: "06:00 AM", status: "ON Duty", duration: "1.0 hr", notes: "Morning cargo verification and log signoff" },
      { time: "07:00 AM", status: "Driving", duration: "2.5 hrs", notes: "Day 2 transit heading towards Orlando" },
      { time: "09:30 AM", status: "ON Duty", duration: "45 min", notes: "Interim terminal dropoff checking" },
      { time: "10:15 AM", status: "Driving", duration: "3.8 hrs", notes: "Transit from Orlando south corridor" },
      { time: "02:00 PM", status: "ON Duty", duration: "1.5 hrs", notes: "Miami Port discharge and post-trip logs submission" }
    ]
  }
]

export function DailyBreakdown() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1)

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day)
  }

  const getStatusBadge = (status: DutyChange["status"]) => {
    switch (status) {
      case "Driving":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-850"
      case "ON Duty":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-850"
      case "OFF Duty":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-850"
      case "Sleeper Berth":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-850"
    }
  }

  return (
    <div className="space-y-4 select-none">
      {mockDays.map((dayData) => {
        const isExpanded = expandedDay === dayData.day;
        return (
          <div
            key={dayData.day}
            className="border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-950/70 shadow-md backdrop-blur-md"
          >
            {/* Header Accordion trigger */}
            <button
              onClick={() => toggleDay(dayData.day)}
              className="w-full flex items-center justify-between p-5 focus:outline-none text-left cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-sm">
                    D{dayData.day}
                  </span>
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-50 text-base">
                    Day {dayData.day} Breakdown
                  </h4>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">
                  {dayData.date} • {dayData.miles} mi coverage
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-blue-500" /> {dayData.driveTime} drive</span>
                  <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5 text-amber-500" /> {dayData.fuelStops} stops</span>
                  <span className="flex items-center gap-1"><Coffee className="h-3.5 w-3.5 text-emerald-500" /> {dayData.restBreaks} breaks</span>
                </div>
                {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-450" /> : <ChevronDown className="h-5 w-5 text-slate-450" />}
              </div>
            </button>

            {/* Expandable Duty grid logs */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-slate-100 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/10 space-y-6">
                    {/* HOS mini summaries */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-slate-200/40 rounded-xl bg-white/40 dark:border-slate-850 dark:bg-slate-950/40">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Driving Limit Used</p>
                        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{dayData.driveTime}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Duty Window Used</p>
                        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{dayData.onDutyTime}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Mandatory Sleeper</p>
                        <p className="text-sm font-extrabold text-slate-850 dark:text-slate-200">{dayData.overnightSleeper ? "Compliant 10h Berth" : "None Required"}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-green-500 font-bold">
                        <ShieldCheck className="h-4.5 w-4.5" /> Full Compliance
                      </div>
                    </div>

                    {/* Sequential Log Records */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Duty Status Change Log</h5>
                      
                      <div className="divide-y divide-slate-100 dark:divide-slate-850">
                        {dayData.changes.map((change, idx) => (
                          <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-4">
                              <span className="font-mono font-bold text-slate-500 dark:text-slate-450 w-16">{change.time}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(change.status)}`}>
                                {change.status}
                              </span>
                              <span className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                                {change.notes}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 font-mono text-right sm:self-center">
                              {change.duration} segment
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
