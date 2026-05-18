import { Sparkles, Info, Fuel, AlertCircle } from "lucide-react"

export interface Insight {
  text: string;
  type: "info" | "fuel" | "rest" | "warning";
}

interface SmartInsightsProps {
  insights: Insight[];
}

export function SmartInsights({ insights }: SmartInsightsProps) {
  const getIcon = (type: Insight["type"]) => {
    switch (type) {
      case "info":
        return <Sparkles className="h-4 w-4 text-blue-500" />
      case "fuel":
        return <Fuel className="h-4 w-4 text-amber-500" />
      case "rest":
        return <Info className="h-4 w-4 text-emerald-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStyle = (type: Insight["type"]) => {
    switch (type) {
      case "info":
        return "border-blue-100 bg-blue-50/50 text-blue-800 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-300 shadow-blue-500/5"
      case "fuel":
        return "border-amber-100 bg-amber-50/50 text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300 shadow-amber-500/5"
      case "rest":
        return "border-emerald-100 bg-emerald-50/50 text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-300 shadow-emerald-500/5"
      case "warning":
        return "border-red-100 bg-red-50/50 text-red-800 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-300 shadow-red-500/5"
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {insights.map((insight, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-3 p-4 rounded-xl border shadow-sm backdrop-blur-md transition-all hover:scale-[1.02] ${getStyle(
            insight.type
          )}`}
        >
          <div className="mt-0.5 p-1 rounded-lg bg-white dark:bg-slate-900/80 shadow-sm">
            {getIcon(insight.type)}
          </div>
          <p className="text-xs font-semibold leading-relaxed">{insight.text}</p>
        </div>
      ))}
    </div>
  )
}
