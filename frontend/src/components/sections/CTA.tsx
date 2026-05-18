import { motion } from "framer-motion"
import { Button } from "../ui/button"

interface CTAProps {
  onNavigatePlanner: () => void;
}

export function CTA({ onNavigatePlanner }: CTAProps) {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-900/10"></div>
      <div className="container relative mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center space-y-8"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
            Start Planning Smarter Routes Today
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-slate-600 dark:text-slate-400">
            Ensure your trips are optimal, profitable, and 100% HOS compliant. Start for free.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="h-12 px-10 text-base" onClick={onNavigatePlanner}>
              Generate Trip Plan
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
