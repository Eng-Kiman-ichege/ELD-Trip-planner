import { motion } from "framer-motion"
import { MapPin, Cpu, ClipboardList } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            How RouteELD Works
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-slate-600 dark:text-slate-400">
            Plan your entire trip in seconds with our simple 3-step process.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Connecting Line */}
          <div className="absolute top-12 left-[10%] right-[10%] hidden h-0.5 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-200 md:block dark:from-slate-700 dark:via-blue-600 dark:to-slate-700"></div>

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative flex flex-col items-center text-center space-y-4"
            >
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow-sm dark:border-slate-900 dark:bg-blue-900/30 dark:text-blue-400">
                <MapPin className="h-10 w-10" />
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">1</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Enter Trip Details</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Input your current location, destination, and available HOS driving hours.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative flex flex-col items-center text-center space-y-4"
            >
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-amber-100 text-amber-600 shadow-sm dark:border-slate-900 dark:bg-amber-900/30 dark:text-amber-400">
                <Cpu className="h-10 w-10" />
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white shadow-sm">2</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">System Calculates</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our AI generates the optimal route, injecting required 30-min breaks and 10-hour rests.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative flex flex-col items-center text-center space-y-4"
            >
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shadow-sm dark:border-slate-900 dark:bg-emerald-900/30 dark:text-emerald-400">
                <ClipboardList className="h-10 w-10" />
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-sm">3</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Generate Driver Logs</h3>
              <p className="text-slate-600 dark:text-slate-400">
                View your complete visual timeline and generate a DOT-compliant daily log graph.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
