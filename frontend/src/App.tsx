import { useState } from "react"
import { Navbar } from "./components/sections/Navbar"
import { Hero } from "./components/sections/Hero"
import { Features } from "./components/sections/Features"
import { HowItWorks } from "./components/sections/HowItWorks"
import { DashboardPreview } from "./components/sections/DashboardPreview"
import { Statistics } from "./components/sections/Statistics"
import { Testimonials } from "./components/sections/Testimonials"
import { CTA } from "./components/sections/CTA"
import { Footer } from "./components/sections/Footer"
import { TripPlanner } from "./components/pages/TripPlanner"

function App() {
  const [page, setPage] = useState<'home' | 'planner'>('home')

  const handleNavigatePlanner = () => {
    setPage('planner')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateHome = () => {
    setPage('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      <Navbar onNavigatePlanner={handleNavigatePlanner} onNavigateHome={handleNavigateHome} page={page} />
      <main>
        {page === 'home' ? (
          <>
            <Hero onNavigatePlanner={handleNavigatePlanner} />
            <Features />
            <HowItWorks />
            <DashboardPreview />
            <Statistics />
            <Testimonials />
            <CTA onNavigatePlanner={handleNavigatePlanner} />
          </>
        ) : (
          <TripPlanner onNavigateHome={handleNavigateHome} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
