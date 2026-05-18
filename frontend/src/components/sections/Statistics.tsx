import { motion } from "framer-motion"

const stats = [
  { value: "10K+", label: "Trips Planned" },
  { value: "99.8%", label: "Route Accuracy" },
  { value: "70hr/8d", label: "Compliance Assured" },
  { value: "24/7", label: "Real-time Auditing" }
]

export function Statistics() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-900/10 dark:bg-blue-950/20"></div>
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-blue-400">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-slate-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
