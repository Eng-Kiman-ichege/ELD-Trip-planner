import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Route, ShieldAlert, FileText, Fuel, CalendarDays, Map as MapIcon } from "lucide-react"

const features = [
  {
    title: "Smart Route Planning",
    description: "AI-powered routing that avoids truck-restricted roads, low bridges, and optimizes for fastest compliant paths.",
    icon: Route,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-500/20"
  },
  {
    title: "Automatic HOS Compliance",
    description: "Real-time calculation of your 11-hour, 14-hour, and 70-hour rules to prevent DOT violations automatically.",
    icon: ShieldAlert,
    color: "text-red-500",
    bg: "bg-red-100 dark:bg-red-500/20"
  },
  {
    title: "ELD Log Generation",
    description: "Generate FMCSA-compliant daily logs instantly. Export directly to your dispatcher or DOT inspector.",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-500/20"
  },
  {
    title: "Fuel Stop Detection",
    description: "Intelligently finds truck-friendly fuel stations along your route right when you need them.",
    icon: Fuel,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-500/20"
  },
  {
    title: "Multi-Day Trip Scheduling",
    description: "Plan cross-country trips with overnight parking, 34-hour restarts, and split sleeper berth provisions handled for you.",
    icon: CalendarDays,
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-500/20"
  },
  {
    title: "Interactive Route Maps",
    description: "Visual timelines and interactive maps showing exactly where and when you need to stop for maximum efficiency.",
    icon: MapIcon,
    color: "text-cyan-500",
    bg: "bg-cyan-100 dark:bg-cyan-500/20"
  }
]

export function Features() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            Everything You Need for Compliant Driving
          </h2>
          <p className="mx-auto max-w-[700px] text-lg text-slate-600 dark:text-slate-400">
            RouteELD takes the guesswork out of trip planning. We handle the complex HOS math so you can focus on driving.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 dark:hover:border-slate-700">
                <CardHeader>
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
