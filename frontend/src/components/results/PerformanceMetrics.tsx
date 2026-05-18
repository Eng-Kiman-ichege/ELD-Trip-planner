import { Card, CardContent } from "../ui/card"
import { Zap, Gauge, DollarSign, Award, CheckCircle, Navigation } from "lucide-react"

interface MetricItem {
  name: string;
  value: string;
  sub: string;
  score: number; // 0 to 100
  icon: React.ReactNode;
  color: string;
}

const mockMetrics: MetricItem[] = [
  { name: "Average Speed", value: "54.8 mph", sub: "Standard truck optimal speed", score: 85, icon: <Gauge className="h-5 w-5" />, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
  { name: "Fuel Efficiency", value: "6.8 MPG", sub: "+0.3 MPG better than fleet avg", score: 92, icon: <Zap className="h-5 w-5" />, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" },
  { name: "Compliance Score", value: "100%", sub: "Zero active HOS violations flagged", score: 100, icon: <CheckCircle className="h-5 w-5" />, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" },
  { name: "Est. Fuel Cost", value: "$612.00", sub: "Based on $3.60/gal diesel price", score: 78, icon: <DollarSign className="h-5 w-5" />, color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20" },
  { name: "Route Optimization", value: "98.4%", sub: "9.2% shorter than baseline path", score: 98, icon: <Navigation className="h-5 w-5" />, color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20" },
  { name: "Delivery Efficiency", value: "Optimal", sub: "Pre-scheduled pickup & dropoff windows", score: 95, icon: <Award className="h-5 w-5" />, color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20" }
]

export function PerformanceMetrics() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 select-none">
      {mockMetrics.map((item) => (
        <Card key={item.name} className="border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 hover:shadow-xl transition-shadow shadow-sm backdrop-blur-md rounded-2xl">
          <CardContent className="p-5 flex items-start gap-4">
            <div className={`p-3 rounded-xl ${item.color} shrink-0`}>
              {item.icon}
            </div>
            
            <div className="flex-1 space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                {item.name}
              </span>
              <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-50">
                {item.value}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                {item.sub}
              </p>
              
              {/* Score bar */}
              <div className="pt-2">
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
