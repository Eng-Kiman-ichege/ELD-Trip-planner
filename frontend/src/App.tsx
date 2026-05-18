import { Navbar } from "./components/sections/Navbar"
import { Hero } from "./components/sections/Hero"
import { Features } from "./components/sections/Features"
import { HowItWorks } from "./components/sections/HowItWorks"
import { DashboardPreview } from "./components/sections/DashboardPreview"
import { Statistics } from "./components/sections/Statistics"
import { Testimonials } from "./components/sections/Testimonials"
import { CTA } from "./components/sections/CTA"
import { Footer } from "./components/sections/Footer"

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <DashboardPreview />
        <Statistics />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default App
