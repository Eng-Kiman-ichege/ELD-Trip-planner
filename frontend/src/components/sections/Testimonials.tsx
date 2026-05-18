import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Marcus Vance",
    role: "Owner-Operator",
    quote: "RouteELD saved me from three potential HOS violations in my first week. The way it schedules fuel stops and breaks is exactly how a real trucker drives.",
    stars: 5
  },
  {
    name: "Sarah Jenkins",
    role: "Dispatch Manager, Apex Logistics",
    quote: "Managing a fleet of 50+ trucks gets chaotic. RouteELD gives my dispatchers instant route previews that align perfectly with whatever ELD logs our drivers run.",
    stars: 5
  },
  {
    name: "Dave Miller",
    role: "Long-Haul Driver",
    quote: "The visual DOT log preview is a game-changer. I know exactly what my day looks like before I even turn the key. Simple, clear, and extremely reliable.",
    stars: 5
  }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            Trusted by the Road's Finest
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-slate-600 dark:text-slate-400">
            Hear from the drivers and fleet managers who keep America moving with RouteELD.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white dark:bg-slate-950 flex flex-col justify-between hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg font-bold">{t.name}</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-slate-600 dark:text-slate-400 italic text-sm leading-relaxed">
                    "{t.quote}"
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
