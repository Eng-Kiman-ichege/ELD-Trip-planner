import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Map, Clock, Fuel, ShieldCheck, Play } from "lucide-react"

interface HeroProps {
  onNavigatePlanner: () => void;
}

export function Hero({ onNavigatePlanner }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-16 md:pt-24 lg:pt-32 dark:bg-slate-950">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="space-y-4">
              <Badge variant="secondary" className="inline-flex">
                <ShieldCheck className="mr-1 h-3 w-3" />
                FMCSA Compliant
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl xl:text-6xl dark:text-slate-50">
                Smart ELD Trip Planning for <span className="text-blue-600 dark:text-blue-500">Truck Drivers</span>
              </h1>
              <p className="max-w-[600px] text-lg text-slate-600 dark:text-slate-400">
                Automatically generate compliant routes, rest stops, fuel stops, and DOT driver logs using Hours of Service rules.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-12 px-8" onClick={onNavigatePlanner}>Start Trip Planning</Button>
              <Button size="lg" variant="outline" className="h-12 px-8">
                <Play className="mr-2 h-4 w-4" /> View Demo
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                <ShieldCheck className="mr-1.5 h-4 w-4 text-blue-500" /> FMCSA HOS Rules
              </div>
              <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                <Map className="mr-1.5 h-4 w-4 text-blue-500" /> Route Optimization
              </div>
              <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                <Clock className="mr-1.5 h-4 w-4 text-blue-500" /> ELD Log Generation
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto w-full max-w-[500px] lg:max-w-none"
          >
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 opacity-20 blur-2xl"></div>
            <Card className="relative overflow-hidden border-slate-200/50 bg-white/50 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/50">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Active Trip: Dallas, TX to Chicago, IL</CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                    Compliant
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-48 bg-slate-100 dark:bg-slate-900 relative">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNFMkU4RjAiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMzMzQxNTUiLz48L3N2Zz4=')]"></div>
                  
                  {/* Mock Route Line */}
                  <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                    <path d="M 50 150 Q 150 50, 250 100 T 450 50" fill="none" stroke="currentColor" strokeWidth="4" className="text-blue-500 drop-shadow-md" strokeDasharray="8 8" />
                    <circle cx="50" cy="150" r="6" className="fill-blue-600" />
                    <circle cx="450" cy="50" r="6" className="fill-red-500" />
                  </svg>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-6">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Driving Hours Left</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-xl font-bold text-slate-900 dark:text-slate-50">08:45</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Next Stop</p>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">Loves Travel Stop (120mi)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-6 top-1/4 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                  <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">30-Min Break</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-50">Completed</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
