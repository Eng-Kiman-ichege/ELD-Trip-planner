import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { 
  ShieldCheck, FileText, CheckCircle2, ChevronRight, Download, 
  Printer, Share2, Clock, Eye, AlertCircle, Calendar, Sparkles, Navigation 
} from "lucide-react"

// Types for activities
interface Activity {
  time: string;
  location: string;
  status: "OFF" | "SB" | "D" | "ON";
  duration: string;
  remarks: string;
}

// Activity data per day
const dailyActivities: Record<string, Activity[]> = {
  "Day 1": [
    { time: "08:00 AM", location: "Dallas Terminal, TX", status: "ON", duration: "0.5 hrs", remarks: "Pre-trip inspection & cargo verification" },
    { time: "08:30 AM", location: "I-20 Eastbound, TX", status: "D", duration: "4.0 hrs", remarks: "Initial driving segment" },
    { time: "12:30 PM", location: "Loves Fuel Stop #48, TX", status: "ON", duration: "0.5 hrs", remarks: "Fuel stop & mid-trip walkaround check" },
    { time: "01:00 PM", location: "I-20 Eastbound, LA", status: "D", duration: "3.5 hrs", remarks: "Post-fuel driving segment" },
    { time: "04:30 PM", location: "Meridian Pilot, MS", status: "OFF", duration: "0.5 hrs", remarks: "Mandatory 30-minute rest break" },
    { time: "05:00 PM", location: "I-59 Southbound, AL", status: "D", duration: "3.0 hrs", remarks: "Final daily driving stretch" },
    { time: "08:00 PM", location: "Atlanta Rest Oasis, GA", status: "SB", duration: "10.0 hrs", remarks: "Overnight rest (Sleeper Berth)" }
  ],
  "Day 2": [
    { time: "06:00 AM", location: "Atlanta Rest Oasis, GA", status: "ON", duration: "0.5 hrs", remarks: "Pre-trip inspections & safety check" },
    { time: "06:30 AM", location: "I-75 Southbound, GA", status: "D", duration: "3.0 hrs", remarks: "Day 2 driving start" },
    { time: "09:30 AM", location: "Orlando Logistics Depot, FL", status: "ON", duration: "0.5 hrs", remarks: "Mid-route trailer check & air brake audit" },
    { time: "10:00 AM", location: "I-95 Southbound, FL", status: "D", duration: "4.0 hrs", remarks: "Final stretch to Miami Port" },
    { time: "02:00 PM", location: "Miami Cargo Discharge, FL", status: "ON", duration: "1.0 hrs", remarks: "Post-trip check & trailer handover" },
    { time: "03:00 PM", location: "Miami Port, FL", status: "OFF", duration: "15.0 hrs", remarks: "Off-duty HOS release" }
  ],
  "Day 3": [
    { time: "08:00 AM", location: "Miami Port, FL", status: "OFF", duration: "24.0 hrs", remarks: "Full Day off-duty HOS rest" }
  ],
  "Day 4": [
    { time: "08:00 AM", location: "Miami Port, FL", status: "OFF", duration: "24.0 hrs", remarks: "Full Day off-duty HOS rest" }
  ]
}

// Grid layout calculations for SVG Graph
// 24 Hours segments
const hours = Array.from({ length: 25 }, (_, i) => i)

export function EldLogs() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"Day 1" | "Day 2" | "Day 3" | "Day 4">("Day 1")
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => setDownloading(false), 2000)
  }

  // Get active activities
  const activities = dailyActivities[activeTab] || []

  // Dynamic SVG path builder for the 24 hour ELD grid
  // Rows: OFF (0), SB (1), D (2), ON (3)
  // Grid Dimensions: width 720px, height 160px (4 rows * 40px)
  const getEldSvgPath = () => {
    if (activeTab === "Day 1") {
      // 00:00 to 08:00 = SB (Sleeper)
      // 08:00 to 08:30 = ON (On-duty)
      // 08:30 to 12:30 = D (Driving)
      // 12:30 to 13:00 = ON
      // 13:00 to 16:30 = D
      // 16:30 to 17:00 = OFF (Off-duty)
      // 17:00 to 20:00 = D
      // 20:00 to 24:00 = SB
      return "M 0 60 L 240 60 L 240 140 L 255 140 L 255 100 L 375 100 L 375 140 L 390 140 L 390 100 L 495 100 L 495 20 L 510 20 L 510 100 L 600 100 L 600 60 L 720 60"
    } else if (activeTab === "Day 2") {
      // 00:00 to 06:00 = SB
      // 06:00 to 06:30 = ON
      // 06:30 to 09:30 = D
      // 09:30 to 10:00 = ON
      // 10:00 to 14:00 = D
      // 14:00 to 15:00 = ON
      // 15:00 to 24:00 = OFF
      return "M 0 60 L 180 60 L 180 140 L 195 140 L 195 100 L 285 100 L 285 140 L 300 140 L 300 100 L 420 100 L 420 140 L 450 140 L 450 20 L 720 20"
    } else {
      // Full 24 hours OFF
      return "M 0 20 L 720 20"
    }
  }

  return (
    <PageContainer className="bg-slate-50 dark:bg-slate-950">
      <div className="container relative mx-auto px-4 md:px-6 space-y-10">
        
        {/* Breadcrumb / Back button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/trip/1")} 
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer focus:outline-none"
          >
            Trip Results
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700" />
          <span className="text-xs font-bold text-slate-400 dark:text-slate-650">ELD Compliance Logs</span>
        </div>

        {/* A. Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-3 max-w-[800px]">
            <Badge className="bg-blue-600/90 text-white border-0 flex items-center gap-1.5 h-6 text-[10px] uppercase font-bold tracking-wider px-3 rounded-full w-fit">
              <ShieldCheck className="h-3.5 w-3.5" /> FMCSA Certified
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
              Driver ELD Logs & Duty Status
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
              Review generated DOT-compliant driver logs and duty status breakdowns.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 flex items-center gap-1.5 shadow h-7 text-xs px-3 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5" /> HOS Compliant
            </Badge>
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0 flex items-center gap-1.5 shadow h-7 text-xs px-3 rounded-full">
              <FileText className="h-3.5 w-3.5" /> Logs Generated
            </Badge>
            <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-0 flex items-center gap-1.5 shadow h-7 text-xs px-3 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" /> DOT Ready
            </Badge>
          </div>
        </div>

        {/* Quick Nav Button bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="h-9 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => navigate("/trip/1")}>
              Back To Results
            </Button>
            <Button variant="outline" className="h-9 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => navigate("/trip/1/stops")}>
              View Stops Timeline
            </Button>
            <Button variant="outline" className="h-9 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => navigate("/dashboard")}>
              Open Dashboard
            </Button>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-950 p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Carrier: RouteELD Express</span>
          </div>
        </div>

        {/* B. Daily Log Tabs */}
        <div className="flex justify-center sm:justify-start gap-1 bg-slate-200/50 dark:bg-slate-900/50 p-1 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl w-fit">
          {(["Day 1", "Day 2", "Day 3", "Day 4"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-10 px-5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
                activeTab === tab 
                  ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-sm" 
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              {tab === "Day 1" ? "Day 1 (Active)" : tab === "Day 2" ? "Day 2 (Active)" : tab}
            </button>
          ))}
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
                <CardDescription>Official federal compliance log rendering sheet</CardDescription>
              </div>
              <Badge variant="outline" className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-400 font-extrabold text-[10px] tracking-wider uppercase border-0">
                Log Date: May 18, 2026
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 overflow-x-auto">
            
            {/* The SVG Log Graph Grid container */}
            <div className="min-w-[760px] p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center">
              
              <div className="relative w-[720px] h-[190px] mt-4 select-none">
                
                {/* Horizontal duty status labels (Y Axis) */}
                <div className="absolute -left-14 top-0 h-full flex flex-col justify-between text-[10px] font-black text-slate-450 text-right pr-3 pt-1 mb-2">
                  <div className="h-10 flex items-center justify-end">OFF</div>
                  <div className="h-10 flex items-center justify-end">SB</div>
                  <div className="h-10 flex items-center justify-end">D</div>
                  <div className="h-10 flex items-center justify-end">ON</div>
                </div>

                {/* Grid rows background dividers */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((r) => (
                    <div key={r} className="border-b border-slate-200 dark:border-slate-800 w-full h-0"></div>
                  ))}
                </div>

                {/* Grid vertical hourly segment lines */}
                <div className="absolute inset-0 flex justify-between pointer-events-none">
                  {hours.map((h) => (
                    <div 
                      key={h} 
                      className={`h-full border-r ${
                        h % 6 === 0 
                          ? "border-slate-300 dark:border-slate-700 border-dashed" 
                          : "border-slate-200 dark:border-slate-800/60"
                      }`}
                    ></div>
                  ))}
                </div>

                {/* SVG Active Duty Track Renderer */}
                <svg className="absolute inset-0 w-full h-160px" style={{ height: "160px" }}>
                  <path 
                    d={getEldSvgPath()}
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)] animate-pulse-slow"
                  />
                </svg>

                {/* Grid hourly text labels (X Axis bottom) */}
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

            {/* Compliance Legend markers */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-4 bg-[#3b82f6] rounded"></div>
                <span>OFF: Off Duty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-4 bg-[#6366f1] rounded"></div>
                <span>SB: Sleeper Berth</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-4 bg-[#ef4444] rounded"></div>
                <span>D: Driving Tracks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-4 bg-[#f59e0b] rounded"></div>
                <span>ON: On Duty (Not Driving)</span>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* D. Duty Status Breakdown Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Driving Hours</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {activeTab === "Day 1" ? "10.5 hrs" : activeTab === "Day 2" ? "7.0 hrs" : "0.0 hrs"}
            </p>
            <span className="text-[9px] font-bold text-slate-400">11:00 hr limit compliant</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">On Duty Hours</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {activeTab === "Day 1" ? "1.0 hrs" : activeTab === "Day 2" ? "2.0 hrs" : "0.0 hrs"}
            </p>
            <span className="text-[9px] font-bold text-slate-400">Loading & checkpoints</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Off Duty Hours</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {activeTab === "Day 1" ? "0.5 hrs" : activeTab === "Day 2" ? "15.0 hrs" : "24.0 hrs"}
            </p>
            <span className="text-[9px] font-bold text-slate-400">30m break + releases</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Sleeper Berth</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {activeTab === "Day 1" ? "10.0 hrs" : activeTab === "Day 2" ? "0.0 hrs" : "0.0 hrs"}
            </p>
            <span className="text-[9px] font-bold text-slate-400">Overnight rest stop</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Remaining Drive</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {activeTab === "Day 1" ? "0.5 hrs" : activeTab === "Day 2" ? "4.0 hrs" : "11.0 hrs"}
            </p>
            <span className="text-[9px] font-bold text-slate-400">Next segments quota</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Remaining Cycle</span>
            <p className="text-2xl font-black text-indigo-500">37.5 hrs</p>
            <span className="text-[9px] font-bold text-slate-400">70h/8-Day active budget</span>
          </Card>
        </div>

        {/* E. Driver Activity Timeline */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-blue-500 animate-pulse-slow" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Driver Activity Checkpoint Log ({activeTab})</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activities.map((act, index) => (
              <Card key={index} className="border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 shadow-md rounded-2xl hover:scale-[1.01] transition-transform">
                <CardHeader className="border-b border-slate-100 dark:border-slate-850 pb-3 p-5 flex flex-row justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black rounded-lg px-2.5 py-1 ${
                      act.status === "D" 
                        ? "bg-red-500 text-white" 
                        : act.status === "SB" 
                        ? "bg-indigo-500 text-white" 
                        : act.status === "OFF" 
                        ? "bg-emerald-500 text-white" 
                        : "bg-amber-500 text-white"
                    }`}>
                      {act.status}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{act.time}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{act.duration}</span>
                </CardHeader>
                <CardContent className="p-5 space-y-2">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-450">Location: <span className="text-slate-900 dark:text-slate-200">{act.location}</span></p>
                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">{act.remarks}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* F. Compliance Analysis Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Logistics Audit Compliance Status</h3>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="border-l-4 border-l-green-500 border border-slate-200/50 bg-white/70 dark:bg-slate-950/70 p-5 rounded-2xl flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">11-Hour Driving Rule</h4>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold mt-1">Driving segments verified under the maximum 11-hour limit today.</p>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800 h-5 text-[9px] mt-2 font-bold uppercase rounded-md">Compliant</Badge>
              </div>
            </Card>

            <Card className="border-l-4 border-l-green-500 border border-slate-200/50 bg-white/70 dark:bg-slate-950/70 p-5 rounded-2xl flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">14-Hour Windows Limit</h4>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold mt-1">All loading and duty intervals are within the maximum daily 14-hour slot.</p>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800 h-5 text-[9px] mt-2 font-bold uppercase rounded-md">Compliant</Badge>
              </div>
            </Card>

            <Card className="border-l-4 border-l-amber-500 border border-slate-200/50 bg-white/70 dark:bg-slate-950/70 p-5 rounded-2xl flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">30-Minute Rest Audit</h4>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold mt-1">Driver took a mandatory rest stop near Meridian, MS after 4 hrs of drive.</p>
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-250 dark:border-amber-800 h-5 text-[9px] mt-2 font-bold uppercase rounded-md">Rest Taken</Badge>
              </div>
            </Card>

            <Card className="border-l-4 border-l-green-500 border border-slate-200/50 bg-white/70 dark:bg-slate-950/70 p-5 rounded-2xl flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">70-Hour Cycle Rule</h4>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold mt-1">Multi-day cycle hours tracked under the maximum 70-hour / 8-day FMCSA limit.</p>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800 h-5 text-[9px] mt-2 font-bold uppercase rounded-md">Compliant</Badge>
              </div>
            </Card>
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
              onClick={handleDownload}
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
