import { useState, useEffect } from "react"
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
import { ResultsDashboard } from "./components/results/ResultsDashboard"

function App() {
  const [page, setPage] = useState<'home' | 'planner' | 'results'>('home')
  const [isDark, setIsDark] = useState(false)

  // Load and apply persistent dark/light theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    } else {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    }
  }, [])

  // Toggle dark/light theme
  const handleToggleTheme = () => {
    const nextDarkState = !isDark
    setIsDark(nextDarkState)
    if (nextDarkState) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleNavigatePlanner = () => {
    setPage('planner')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateHome = () => {
    setPage('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateResults = () => {
    setPage('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
      <Navbar 
        onNavigatePlanner={handleNavigatePlanner} 
        onNavigateHome={handleNavigateHome} 
        page={page} 
        isDark={isDark} 
        onToggleTheme={handleToggleTheme} 
      />
      <main>
        {page === 'home' && (
          <>
            <Hero onNavigatePlanner={handleNavigatePlanner} />
            <Features />
            <HowItWorks />
            <DashboardPreview />
            <Statistics />
            <Testimonials />
            <CTA onNavigatePlanner={handleNavigatePlanner} />
          </>
        )}
        {page === 'planner' && (
          <TripPlanner 
            onNavigateHome={handleNavigateHome} 
            onNavigateResults={handleNavigateResults} 
          />
        )}
        {page === 'results' && (
          <ResultsDashboard 
            onNavigatePlanner={handleNavigatePlanner} 
            onNavigateHome={handleNavigateHome} 
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
