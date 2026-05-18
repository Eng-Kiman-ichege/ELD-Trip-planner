import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Badge } from "../ui/badge"
import { LayoutDashboard, Route, Clock, FileText, ChevronRight, User } from "lucide-react"

export function DashboardPreview() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-8 items-start">
          
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            <Badge variant="secondary" className="inline-flex">
              <LayoutDashboard className="mr-1 h-3 w-3" /> Dashboard
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
              Interactive Logistics Command Center
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Monitor your drivers, track route milestones, and ensure active HOS compliance from a unified digital cockpit.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <ChevronRight className="h-4 w-4 text-blue-500" /> Real-time location updates
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <ChevronRight className="h-4 w-4 text-blue-500" /> Automated HOS warnings
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <ChevronRight className="h-4 w-4 text-blue-500" /> Instant PDF log export
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 relative">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-30 blur-3xl"></div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-slate-200/60 shadow-xl dark:border-slate-800/60 dark:bg-slate-950/80 backdrop-blur-md">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-bold">RouteELD Dispatch Console</CardTitle>
                      <CardDescription>Active Trip Logs & Driver Schedules</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">Driver: John Doe</Badge>
                      <Badge variant="secondary">ELD Connected</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30">
                      <p className="text-xs text-slate-500">Cycle Left</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100">42:15 hrs</p>
                    </div>
                    <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30">
                      <p className="text-xs text-slate-500">Break Due</p>
                      <p className="text-lg font-bold text-amber-600 dark:text-amber-500">03:22 hrs</p>
                    </div>
                    <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30">
                      <p className="text-xs text-slate-500">HOS Status</p>
                      <p className="text-lg font-bold text-green-600">Active Duty</p>
                    </div>
                    <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30">
                      <p className="text-xs text-slate-500">Fuel Required</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100">140 gal</p>
                    </div>
                  </div>

                  {/* Visual ELD Graph Mock */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Duty Status Grid (DOT-style)</h4>
                      <Badge variant="outline" className="text-xs">FMCSA 395.8</Badge>
                    </div>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-900 text-white font-mono text-xs overflow-x-auto">
                      <div className="grid grid-cols-24 gap-px border-b border-slate-800 pb-2 mb-2 min-w-[480px]">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className="text-center text-[9px] text-slate-500">{i}</div>
                        ))}
                      </div>
                      <div className="space-y-2 min-w-[480px]">
                        <div className="flex items-center gap-4">
                          <span className="w-8 text-[10px] text-slate-400">OFF</span>
                          <div className="flex-1 h-3 bg-slate-950 relative rounded">
                            <div className="absolute left-0 w-1/4 h-full bg-blue-500"></div>
                            <div className="absolute right-0 w-1/6 h-full bg-blue-500"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="w-8 text-[10px] text-slate-400">SB</span>
                          <div className="flex-1 h-3 bg-slate-950 relative rounded">
                            <div className="absolute left-[25%] w-[8%] h-full bg-indigo-500"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="w-8 text-[10px] text-slate-400">D</span>
                          <div className="flex-1 h-3 bg-slate-950 relative rounded">
                            <div className="absolute left-[33%] w-[40%] h-full bg-emerald-500"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="w-8 text-[10px] text-slate-400">ON</span>
                          <div className="flex-1 h-3 bg-slate-950 relative rounded">
                            <div className="absolute left-[73%] w-[10%] h-full bg-amber-500"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trip progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold">Trip Progress</span>
                      <span className="text-slate-500">324 mi / 890 mi total</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-[36%] rounded-full"></div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
