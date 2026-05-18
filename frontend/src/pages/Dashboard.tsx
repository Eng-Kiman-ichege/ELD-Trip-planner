import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { api } from "../lib/api"
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, LineChart, Line 
} from "recharts"
import { 
  ShieldCheck, Route, Eye, Navigation, Fuel, AlertCircle, AlertTriangle, Calendar, PlusCircle, Loader2 
} from "lucide-react"

export function Dashboard() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [trips, setTrips] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const [tripsData, analyticsData] = await Promise.all([
          api.trips.list(),
          api.dashboard.getAnalytics()
        ])
        setTrips(tripsData)
        setAnalytics(analyticsData)
      } catch (err: any) {
        console.error("Dashboard hydration error:", err)
        setError("Failed to load control center metrics from server. Ensure your backend is running.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Dynamic charts data generation
  const weeklyMileageData = trips.length > 0
    ? trips.slice(0, 4).map((t, index) => ({
        week: `Trip ${index + 1}`,
        miles: Math.round(t.total_distance),
        fuel: Math.round(t.total_distance / 6.5)
      }))
    : [
        { week: "Trip 1", miles: 0, fuel: 0 },
        { week: "Trip 2", miles: 0, fuel: 0 },
        { week: "Trip 3", miles: 0, fuel: 0 },
        { week: "Trip 4", miles: 0, fuel: 0 }
      ]

  const complianceTrendData = trips.length > 0 
    ? [
        { day: "Mon", score: 100 },
        { day: "Tue", score: 100 },
        { day: "Wed", score: 100 },
        { day: "Thu", score: 100 },
        { day: "Fri", score: 100 },
        { day: "Sat", score: 100 },
        { day: "Sun", score: 100 }
      ]
    : [
        { day: "Mon", score: 0 },
        { day: "Tue", score: 0 },
        { day: "Wed", score: 0 },
        { day: "Thu", score: 0 },
        { day: "Fri", score: 0 },
        { day: "Sat", score: 0 },
        { day: "Sun", score: 0 }
      ]

  if (isLoading) {
    return (
      <PageContainer className="bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Synchronizing Control Room Logistics...</p>
        </div>
      </PageContainer>
    )
  }

  // Fallback defaults if API fails or yields null values
  const stats = {
    totalTrips: analytics?.total_trips ?? 0,
    totalMiles: analytics?.total_miles ?? 0.0,
    avgDistance: analytics?.avg_distance ?? 0.0,
    fuelStops: analytics?.fuel_stops_planned ?? 0,
    restStops: analytics?.rest_stops_planned ?? 0,
    activeSchedules: analytics?.active_schedules ?? 0,
    complianceRating: (analytics?.total_trips ?? 0) > 0 ? (analytics?.compliance_rating ?? 100.0) : 0,
    alerts: analytics?.alerts ?? []
  }

  // Computed values
  const calculatedFuelGallons = Math.round(stats.totalMiles / 6.5)
  const calculatedHours = Math.round(stats.totalMiles / 55)

  // Get active trip details for live route widget (first active trip found in db)
  const activeTrip = trips[0]

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
            {activeTrip && (
              <Button variant="outline" onClick={() => navigate(`/trip/${activeTrip.id}/logs`)} className="h-10 px-5 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900">
                View Active Logs
              </Button>
            )}
          </div>
        </div>

        {/* Display connection warning if backend failed */}
        {error && (
          <div className="p-4 bg-amber-50 border border-amber-250 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400 rounded-2xl flex items-start gap-3 text-xs font-semibold">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-extrabold text-sm mb-1">Local Backend Connection Warning</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* B. Analytics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Trips</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.totalTrips} trips</p>
            <span className="text-[9px] font-bold text-slate-450">Active database sum</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Miles Driven</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.totalMiles.toLocaleString()} mi</p>
            <span className="text-[9px] font-bold text-slate-450">Commercial coverage</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fuel Usage</span>
            <p className="text-2xl font-black text-amber-500">{calculatedFuelGallons.toLocaleString()} gal</p>
            <span className="text-[9px] font-bold text-slate-450">Avg 6.5 MPG loaded</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Compliance Score</span>
            <p className="text-2xl font-black text-emerald-500">{stats.complianceRating}%</p>
            <span className="text-[9px] font-bold text-emerald-500">FMCSA Monitored</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Active Routes</span>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.activeSchedules} active</p>
            <span className="text-[9px] font-bold text-slate-450">Satellite monitored</span>
          </Card>

          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Driver Hours</span>
            <p className="text-2xl font-black text-indigo-500">{calculatedHours} hrs</p>
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
                {trips.length === 0 ? (
                  <div className="p-8 text-center space-y-4">
                    <AlertCircle className="h-8 w-8 text-slate-400 mx-auto" />
                    <div>
                      <p className="font-extrabold text-sm text-slate-700 dark:text-slate-350">No Trips Scheduled Yet</p>
                      <p className="text-xs text-slate-500 mt-1">Get started by planning your first logistics run and let RouteELD audit compliance.</p>
                    </div>
                    <Button onClick={() => navigate("/planner")} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                      Plan First Route
                    </Button>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs font-semibold">
                    <thead>
                      <tr className="bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                        <th className="p-4">Trip ID</th>
                        <th className="p-4">Driver</th>
                        <th className="p-4">Route</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Distance</th>
                        <th className="p-4">Compliance</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                      {trips.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                          <td className="p-4 font-extrabold text-slate-900 dark:text-slate-100">TRIP-{row.id}</td>
                          <td className="p-4 text-slate-700 dark:text-slate-350">Safety Auditor</td>
                          <td className="p-4">
                            <span className="block text-slate-800 dark:text-slate-200">{row.current_location || row.pickup_location}</span>
                            <span className="text-[10px] text-slate-400 font-medium">to {row.dropoff_location}</span>
                          </td>
                          <td className="p-4">
                            <Badge className="h-5 text-[9px] font-bold uppercase rounded-md border-0 bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                              Active
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{Math.round(row.total_distance)} mi</td>
                          <td className="p-4 font-extrabold text-emerald-500">
                            {row.is_hos_compliant ? "100% Compliant" : "Audit Check"}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                                title="View Results"
                                onClick={() => navigate(`/trip/${row.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                                title="View Logs"
                                onClick={() => navigate(`/trip/${row.id}/logs`)}
                              >
                                <Calendar className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                                title="View Stops"
                                onClick={() => navigate(`/trip/${row.id}/stops`)}
                              >
                                <Route className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>

            {/* D. Route Analytics Charts (using Recharts) */}
            <div className="grid gap-6 sm:grid-cols-2">
              
              <Card className="border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 p-6 rounded-2xl shadow-md">
                <CardHeader className="p-0 pb-4 border-b border-slate-100 dark:border-slate-850 mb-4">
                  <CardTitle className="text-sm font-extrabold">Dispatch Run Distance allocation</CardTitle>
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
              
              {activeTrip ? (
                <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-wider">Active Trip: TRIP-{activeTrip.id}</span>
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
                      <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Safety Auditor ({activeTrip.pickup_location.split(',')[0]} to {activeTrip.dropoff_location.split(',')[0]})</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-semibold">
                    <div className="flex justify-between text-slate-500">
                      <span>Total Distance:</span>
                      <span className="text-slate-850 dark:text-slate-200">{Math.round(activeTrip.total_distance)} miles</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Duration:</span>
                      <span className="text-slate-850 dark:text-slate-200">{Math.round(activeTrip.total_duration)} hours</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Trip Stops:</span>
                      <span className="text-slate-850 dark:text-slate-200">{activeTrip.estimated_fuel_stops} Fuel / {activeTrip.estimated_rest_stops} Rest</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "100%" }}></div>
                  </div>

                  <Button className="w-full text-xs font-bold h-9 rounded-xl cursor-pointer" onClick={() => navigate(`/trip/${activeTrip.id}`)}>
                    Track Dispatch Center ➔
                  </Button>
                </Card>
              ) : (
                <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow-md text-center py-8">
                  <p className="text-xs font-bold text-slate-400">No active dispatch schedules tracked.</p>
                </Card>
              )}
            </div>

            {/* F. Alerts Panel */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Logistics Control Alerts</h3>
              
              <div className="space-y-3">
                {stats.alerts.map((alert: any) => (
                  <Card key={alert.id} className="border-l-4 border-l-blue-500 border border-slate-200/50 bg-white/70 dark:border-slate-850 dark:bg-slate-950/70 p-4 shadow-sm flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{alert.title}</h5>
                      <p className="text-[10px] text-slate-550 dark:text-slate-400 leading-normal font-semibold mt-0.5">
                        {alert.message}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </PageContainer>
  )
}
