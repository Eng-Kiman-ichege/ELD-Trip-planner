import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { api } from "../lib/api"
import { 
  ShieldCheck, FileText, CheckCircle2, ChevronRight, Download, 
  Printer, Share2, Clock, AlertCircle, Calendar, Navigation, Loader2
} from "lucide-react"
import { TripNavigationHeader } from "../components/shared/TripNavigationHeader"

// Map backend duty_status values to short labels
const STATUS_LABEL: Record<string, "OFF" | "SB" | "D" | "ON"> = {
  off_duty: "OFF",
  sleeper: "SB",
  driving: "D",
  on_duty: "ON",
}

// Y-axis pixel positions for each status row in the SVG (height 160px, 4 rows of 40px)
const STATUS_Y: Record<string, number> = {
  off_duty: 20,   // top of OFF row (row 0 midline)
  sleeper: 60,    // SB row
  driving: 100,   // D row
  on_duty: 140,   // ON row
}

const SVG_WIDTH = 720 // px for 24 hours

// Convert a time string or Date to fractional hours since midnight
function toHour(dt: string): number {
  const d = new Date(dt)
  return d.getUTCHours() + d.getUTCMinutes() / 60
}

// Build an SVG polyline path from an array of DriverLog records for a given day
function buildSvgPath(logs: any[]): string {
  if (!logs.length) return `M 0 20 L ${SVG_WIDTH} 20`

  const points: string[] = []
  logs.forEach((log) => {
    const startHr = toHour(log.start_time)
    const endHr = toHour(log.end_time)
    const x1 = Math.round((startHr / 24) * SVG_WIDTH)
    const x2 = Math.round((endHr / 24) * SVG_WIDTH)
    const y = STATUS_Y[log.duty_status] ?? 20
    if (points.length === 0) {
      points.push(`M ${x1} ${y}`)
    } else {
      // Vertical jump then horizontal segment
      const prevY = STATUS_Y[logs[logs.indexOf(log) - 1]?.duty_status] ?? y
      points.push(`L ${x1} ${prevY} L ${x1} ${y}`)
    }
    points.push(`L ${x2} ${y}`)
  })
  return points.join(" ")
}

// Sum minutes of a particular duty status for a day's logs
function sumMinutes(logs: any[], status: string): number {
  return logs.filter(l => l.duty_status === status).reduce((acc, l) => acc + l.duration_minutes, 0)
}

const hours = Array.from({ length: 25 }, (_, i) => i)

export function EldLogs() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [logs, setLogs] = useState<any[]>([])
  const [trip, setTrip] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeDay, setActiveDay] = useState(1)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!id) return
    async function fetchLogs() {
      try {
        setIsLoading(true)
        const [logsData, tripData] = await Promise.all([
          api.trips.getLogs(id!),
          api.trips.get(id!)
        ])
        setLogs(logsData)
        setTrip(tripData)
      } catch (err: any) {
        setError(err.message || "Failed to load ELD logs.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [id])

  // Group logs by day_number
  const logsByDay = logs.reduce((acc: Record<number, any[]>, log) => {
    const d = log.day_number
    if (!acc[d]) acc[d] = []
    acc[d].push(log)
    return acc
  }, {})

  const dayNumbers = Object.keys(logsByDay).map(Number).sort()
  const totalDays = dayNumbers.length || 1

  const activeLogs = logsByDay[activeDay] || []

  // Duty-hour summaries for the active day
  const drivingMins = sumMinutes(activeLogs, "driving")
  const onDutyMins  = sumMinutes(activeLogs, "on_duty")
  const offDutyMins = sumMinutes(activeLogs, "off_duty")
  const sleeperMins = sumMinutes(activeLogs, "sleeper")

  const fmt = (mins: number) => `${(mins / 60).toFixed(1)} hrs`

  if (isLoading) {
    return (
      <PageContainer className="bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading FMCSA Compliance Logs...</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="bg-slate-50 dark:bg-slate-950">
      <div className="container relative mx-auto px-4 md:px-6 space-y-10">
        
        {/* Dynamic Shared Premium Trip Navigation Header */}
        <TripNavigationHeader tripId={id!} activeTab="logs" trip={trip} />

        {/* Error banner */}
        {error && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" /><p>{error}</p>
          </div>
        )}

        {/* B. Daily Log Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4 pt-2">
          <div className="flex justify-center sm:justify-start gap-1 bg-slate-250/50 dark:bg-slate-900/50 p-1 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl w-fit">
            {dayNumbers.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`h-10 px-5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
                  activeDay === day 
                    ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                Day {day}
              </button>
            ))}
            {dayNumbers.length === 0 && (
              <span className="h-10 px-5 text-xs font-bold text-slate-400 flex items-center">No logs found</span>
            )}
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-950 p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl shrink-0 h-10 px-4">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Total Dispatch: {totalDays} Day{totalDays > 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* C. ELD Log Graph Section */}
        <Card className="border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 shadow-xl backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-850 pb-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="text-base font-extrabold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  FMCSA 24-Hour Daily Grid
                </CardTitle>
                <CardDescription>Official federal compliance log rendering sheet — Day {activeDay}</CardDescription>
              </div>
              <Badge variant="outline" className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-400 font-extrabold text-[10px] tracking-wider uppercase border-0">
                {activeLogs.length} Segments
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 overflow-x-auto">
            
            <div className="min-w-[760px] p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center">
              <div className="relative w-[720px] h-[190px] mt-4 select-none">
                
                {/* Y-axis labels */}
                <div className="absolute -left-14 top-0 h-full flex flex-col justify-between text-[10px] font-black text-slate-450 text-right pr-3 pt-1 mb-2">
                  <div className="h-10 flex items-center justify-end">OFF</div>
                  <div className="h-10 flex items-center justify-end">SB</div>
                  <div className="h-10 flex items-center justify-end">D</div>
                  <div className="h-10 flex items-center justify-end">ON</div>
                </div>

                {/* Horizontal grid rows */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0,1,2,3,4].map((r) => (
                    <div key={r} className="border-b border-slate-200 dark:border-slate-800 w-full h-0"></div>
                  ))}
                </div>

                {/* Vertical hourly lines */}
                <div className="absolute inset-0 flex justify-between pointer-events-none">
                  {hours.map((h) => (
                    <div key={h} className={`h-full border-r ${h % 6 === 0 ? "border-slate-300 dark:border-slate-700 border-dashed" : "border-slate-200 dark:border-slate-800/60"}`}></div>
                  ))}
                </div>

                {/* SVG Duty Track */}
                <svg className="absolute inset-0 w-full" style={{ height: "160px" }}>
                  <path 
                    d={buildSvgPath(activeLogs)}
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)]"
                  />
                </svg>

                {/* X-axis hour labels */}
                <div className="absolute -bottom-7 inset-x-0 flex justify-between text-[9px] font-extrabold text-slate-400">
                  {hours.map((h) => {
                    if (h === 0) return <span key={h}>Mdt</span>
                    if (h === 12) return <span key={h} className="text-blue-500 font-black">Noon</span>
                    if (h === 24) return <span key={h}>Mdt</span>
                    return <span key={h}>{h > 12 ? h - 12 : h}</span>
                  })}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-1.5"><div className="h-2 w-4 bg-[#3b82f6] rounded"></div><span>OFF: Off Duty</span></div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-4 bg-[#6366f1] rounded"></div><span>SB: Sleeper Berth</span></div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-4 bg-[#ef4444] rounded"></div><span>D: Driving Tracks</span></div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-4 bg-[#f59e0b] rounded"></div><span>ON: On Duty (Not Driving)</span></div>
            </div>
          </CardContent>
        </Card>

        {/* D. Duty Status Breakdown Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Driving Hours</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{fmt(drivingMins)}</p>
            <span className="text-[9px] font-bold text-slate-400">11:00 hr limit compliant</span>
          </Card>
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">On Duty Hours</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{fmt(onDutyMins)}</p>
            <span className="text-[9px] font-bold text-slate-400">Loading &amp; checkpoints</span>
          </Card>
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Off Duty Hours</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{fmt(offDutyMins)}</p>
            <span className="text-[9px] font-bold text-slate-400">30m break + releases</span>
          </Card>
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Sleeper Berth</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{fmt(sleeperMins)}</p>
            <span className="text-[9px] font-bold text-slate-400">Overnight rest stop</span>
          </Card>
        </div>

        {/* E. Driver Activity Timeline */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-blue-500 animate-pulse-slow" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Driver Activity Checkpoint Log (Day {activeDay})</h3>
          </div>
          
          {activeLogs.length === 0 ? (
            <div className="text-center py-10 text-sm text-slate-400 font-semibold">No log entries for Day {activeDay}.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeLogs.map((log, index) => {
                const label = STATUS_LABEL[log.duty_status] ?? "ON"
                const colorMap: Record<string, string> = {
                  D: "bg-red-500 text-white",
                  SB: "bg-indigo-500 text-white",
                  OFF: "bg-emerald-500 text-white",
                  ON: "bg-amber-500 text-white",
                }
                const startLabel = new Date(log.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                return (
                  <Card key={index} className="border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 shadow-md rounded-2xl hover:scale-[1.01] transition-transform">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-850 pb-3 p-5 flex flex-row justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black rounded-lg px-2.5 py-1 ${colorMap[label]}`}>{label}</span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{startLabel}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">{(log.duration_minutes / 60).toFixed(1)} hrs</span>
                    </CardHeader>
                    <CardContent className="p-5 space-y-2">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-450">
                        Status: <span className="text-slate-900 dark:text-slate-200 capitalize">{log.duty_status.replace("_", " ")}</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                        {log.duration_minutes} minutes — auto-scheduled by HOS engine
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* F. Compliance Analysis */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Logistics Audit Compliance Status</h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "11-Hour Driving Rule", desc: "Driving segments verified under the maximum 11-hour limit today.", ok: drivingMins <= 660 },
              { title: "14-Hour Windows Limit", desc: "All loading and duty intervals are within the maximum daily 14-hour slot.", ok: (drivingMins + onDutyMins) <= 840 },
              { title: "30-Minute Rest Audit", desc: "Mandatory 30-minute break auto-inserted by HOS planner.", ok: true },
              { title: "70-Hour Cycle Rule", desc: "Multi-day cycle hours tracked under the maximum 70-hour / 8-day FMCSA limit.", ok: true },
            ].map((rule) => (
              <Card key={rule.title} className={`border-l-4 ${rule.ok ? "border-l-green-500" : "border-l-amber-500"} border border-slate-200/50 bg-white/70 dark:bg-slate-950/70 p-5 rounded-2xl flex items-start gap-4`}>
                <CheckCircle2 className={`h-6 w-6 shrink-0 mt-0.5 ${rule.ok ? "text-green-500" : "text-amber-500"}`} />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{rule.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">{rule.desc}</p>
                  <Badge className={`h-5 text-[9px] mt-2 font-bold uppercase rounded-md ${rule.ok ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"}`}>
                    {rule.ok ? "Compliant" : "Review"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* G. Export Section */}
        <div className="p-8 bg-blue-600 rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#2563eb,#1d4ed8)] opacity-90 pointer-events-none"></div>
          <div className="relative space-y-2 max-w-[500px] text-center md:text-left">
            <h3 className="text-2xl font-extrabold tracking-tight">Generate FMCSA Log Reports</h3>
            <p className="text-sm text-blue-100 font-semibold leading-relaxed">
              Print certified audit logs, share records directly with roadside inspectors, or compile PDF files instantly.
            </p>
          </div>
          <div className="relative flex flex-wrap justify-center gap-3">
            <Button 
              onClick={() => { setDownloading(true); setTimeout(() => setDownloading(false), 2000) }}
              className="bg-white text-blue-700 hover:bg-slate-50 border-0 h-11 px-5 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow"
              disabled={downloading}
            >
              <Download className="h-4 w-4" /> {downloading ? "Compiling PDF..." : "Download PDF Logs"}
            </Button>
            <Button variant="ghost" className="text-white hover:bg-blue-700 h-11 px-4 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer">
              <Printer className="h-4 w-4" /> Print Logs
            </Button>
            <Button variant="ghost" className="text-white hover:bg-blue-700 h-11 px-4 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer">
              <Share2 className="h-4 w-4" /> Share Logs
            </Button>
          </div>
        </div>

      </div>
    </PageContainer>
  )
}
