import { useNavigate } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid, LineChart, Line 
} from "recharts"
import { 
  ShieldCheck, AlertTriangle, AlertCircle, Info, Calendar, MapPin, 
  Clock, Route, PlusCircle, CheckCircle2, ChevronRight, Eye, Navigation, Fuel 
} from "lucide-react"

// Analytics dashboard charts data
const weeklyMileageData = [
  { week: "Wk 1", miles: 4200, fuel: 640 },
  { week: "Wk 2", miles: 5100, fuel: 780 },
  { week: "Wk 3", miles: 4800, fuel: 730 },
  { week: "Wk 4", miles: 5600, fuel: 860 }
]

const complianceTrendData = [
  { day: "Mon", score: 98 },
  { day: "Tue", score: 100 },
  { day: "Wed", score: 100 },
  { day: "Thu", score: 95 },
  { day: "Fri", score: 100 },
  { day: "Sat", score: 100 },
  { day: "Sun", score: 100 }
]

// Mock listings for table rows
interface TripRow {
  id: string;
  driver: string;
  origin: string;
  dest: string;
  status: "active" | "completed" | "delayed";
  eta: string;
  compliance: string;
}

const recentTrips: TripRow[] = [
  { id: "TX-902", driver: "John Doe", origin: "Dallas, TX", dest: "Miami Port, FL", status: "active", eta: "May 19, 02:00 PM", compliance: "100%" },
  { id: "IL-404", driver: "Sarah Connor", origin: "Chicago, IL", dest: "Houston, TX", status: "completed", eta: "Delivered", compliance: "100%" },
  { id: "CA-112", driver: "Marcus Aurelius", origin: "Los Angeles, CA", dest: "Seattle, WA", status: "delayed", eta: "May 20, 08:30 AM", compliance: "95%" }
]

export function Dashboard() {
  const navigate = useNavigate()

  return (
    <PageContainer className="bg-slate-50 dark:bg-slate-950">
      <div className="container relative mx-auto px-4 md:px-6 space-y-10">
        
        {/* A. Dashboard Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-3 max-w-[800px]">
            <Badge className="bg-blue-600/90 text-white border-0 flex items-center gap-1.5 h-6 text-[10px] uppercase font-bold tracking-wider px-3 rounded-full w-fit">
              <ShieldCheck className="h-3.5 w-3.5" /> Operations Room
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
              Logistics Control Center
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
              Monitor active long-haul trucking routes, compliance scores, and driver schedules.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button onClick={() => navigate("/planner")} className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow">
              <PlusCircle className="h-4 w-4" /> Create New Trip
            </Button>
            <Button variant="outline" onClick={() => navigate("/planner")} className="h-10 px-5 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900">
              Open Planner
            </Button>
            <Button variant="outline" onClick={() => navigate("/trip/1/logs")} className="h-10 px-5 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900">
              View Active Logs
            </Button>
          </div>
        </div>

        {/* B. Analytics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Trips</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">24 trips</p>
            <span className="text-[9px] font-bold text-slate-450">Active monthly budget</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Miles Driven</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">19,700 mi</p>
            <span className="text-[9px] font-bold text-slate-450">Commercial coverage</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fuel Usage</span>
            <p className="text-2xl font-black text-amber-500">3,030 gal</p>
            <span className="text-[9px] font-bold text-slate-450">Avg 6.5 MPG loaded</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Compliance Score</span>
            <p className="text-2xl font-black text-emerald-500">98.3%</p>
            <span className="text-[9px] font-bold text-emerald-500">Excellent safety</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Active Routes</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">3 active</p>
            <span className="text-[9px] font-bold text-slate-450">Satellite monitored</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Driver Hours</span>
            <p className="text-2xl font-black text-indigo-500">142.5 hrs</p>
            <span className="text-[9px] font-bold text-slate-450">Weekly driving sum</span>
          </Card>
        </div>

        {/* Dynamic Splits: Table and Active Route Tracking */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* C. Recent Trips Table (Left Column) */}
          <div className="lg:col-span-8 space-y-6">
            
            <Card className="border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 shadow-xl backdrop-blur-md rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <CardTitle className="text-base font-extrabold">Active & Recent Trip Schedules</CardTitle>
                <CardDescription>Dispatch queue details and driver logs tracking</CardDescription>
              </CardHeader>
              
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  <thead>
                    <tr className="bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                      <th className="p-4">Trip ID</th>
                      <th className="p-4">Driver</th>
                      <th className="p-4">Route</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">ETA</th>
                      <th className="p-4">Compliance</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {recentTrips.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                        <td className="p-4 font-extrabold text-slate-900 dark:text-slate-100">{row.id}</td>
                        <td className="p-4 text-slate-700 dark:text-slate-350">{row.driver}</td>
                        <td className="p-4">
                          <span className="block text-slate-800 dark:text-slate-200">{row.origin}</span>
                          <span className="text-[10px] text-slate-400 font-medium">to {row.dest}</span>
                        </td>
                        <td className="p-4">
                          <Badge className={`h-5 text-[9px] font-bold uppercase rounded-md border-0 ${
                            row.status === "active" 
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" 
                              : row.status === "completed" 
                              ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" 
                              : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                          }`}>
                            {row.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{row.eta}</td>
                        <td className="p-4 font-extrabold text-emerald-500">{row.compliance}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                              title="View Results"
                              onClick={() => navigate("/trip/1")}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                              title="View Logs"
                              onClick={() => navigate("/trip/1/logs")}
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                              title="View Stops"
                              onClick={() => navigate("/trip/1/stops")}
                            >
                              <Route className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* D. Route Analytics Charts (using Recharts) */}
            <div className="grid gap-6 sm:grid-cols-2">
              
              <Card className="border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 p-6 rounded-2xl shadow-md">
                <CardHeader className="p-0 pb-4 border-b border-slate-100 dark:border-slate-850 mb-4">
                  <CardTitle className="text-sm font-extrabold">Weekly Miles & Fuel allocation</CardTitle>
                </CardHeader>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyMileageData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="week" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#020617", border: "0", borderRadius: "12px", color: "#fff", fontSize: "11px" }} />
                      <Bar dataKey="miles" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 p-6 rounded-2xl shadow-md">
                <CardHeader className="p-0 pb-4 border-b border-slate-100 dark:border-slate-850 mb-4">
                  <CardTitle className="text-sm font-extrabold">Log Compliance Trends (Daily)</CardTitle>
                </CardHeader>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[90, 100]} />
                      <Tooltip contentStyle={{ background: "#020617", border: "0", borderRadius: "12px", color: "#fff", fontSize: "11px" }} />
                      <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

            </div>

          </div>

          {/* RIGHT COLUMN: Active Route Tracking & Alerts Panel */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            
            {/* E. Active Route Monitoring */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Live Route Monitoring</h3>
              
              <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-wider">Active Trip: TX-902</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800 font-bold">
                    HOS Compliant
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Navigation className="h-5 w-5 animate-pulse-slow" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Active Driver</span>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">John Doe (Dallas to Miami)</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-semibold">
                  <div className="flex justify-between text-slate-500">
                    <span>Current stop:</span>
                    <span className="text-slate-850 dark:text-slate-200">Meridian Pilot Center</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Remaining distance:</span>
                    <span className="text-slate-850 dark:text-slate-200">560 miles</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>ETA Destination:</span>
                    <span className="text-slate-850 dark:text-slate-200">May 19, 02:00 PM</span>
                  </div>
                </div>

                <div className="w-full bg-slate-105 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "53%" }}></div>
                </div>

                <Button className="w-full text-xs font-bold h-9 rounded-xl" onClick={() => navigate("/trip/1")}>
                  Track Dispatch Center ➔
                </Button>
              </Card>
            </div>

            {/* F. Alerts Panel */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Logistics Control Alerts</h3>
              
              <div className="space-y-3">
                <Card className="border-l-4 border-l-red-500 border border-slate-200/50 bg-white/70 dark:border-slate-850 dark:bg-slate-950/70 p-4 shadow-sm flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">Mandatory 30-min break check</h5>
                    <p className="text-[10px] text-slate-550 dark:text-slate-400 leading-normal font-semibold mt-0.5">
                      Driver Sarah Connor has driven 7.5 continuous hours. HOS alert: rest stop mandatory in 30 minutes!
                    </p>
                  </div>
                </Card>

                <Card className="border-l-4 border-l-amber-500 border border-slate-200/50 bg-white/70 dark:border-slate-850 dark:bg-slate-950/70 p-4 shadow-sm flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">I-95 South Road Construction</h5>
                    <p className="text-[10px] text-slate-550 dark:text-slate-400 leading-normal font-semibold mt-0.5">
                      Heavy traffic expected entering Miami Cargo Gates. Schedule buffers have adjusted ETAs.
                    </p>
                  </div>
                </Card>

                <Card className="border-l-4 border-l-blue-500 border border-slate-200/50 bg-white/70 dark:border-slate-850 dark:bg-slate-950/70 p-4 shadow-sm flex gap-3">
                  <Fuel className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">Diesel Refueling alert</h5>
                    <p className="text-[10px] text-slate-550 dark:text-slate-400 leading-normal font-semibold mt-0.5">
                      Loves Stop diesel prices projected to drop by $0.12/gal near I-20 at midnight.
                    </p>
                  </div>
                </Card>
              </div>

            </div>

          </div>

        </div>

      </div>
    </PageContainer>
  )
}
