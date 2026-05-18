import { useNavigate } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { Hero } from "../components/sections/Hero"
import { Statistics } from "../components/sections/Statistics"
import { Features } from "../components/sections/Features"
import { HowItWorks } from "../components/sections/HowItWorks"
import { DashboardPreview } from "../components/sections/DashboardPreview"
import { Testimonials } from "../components/sections/Testimonials"
import { CTA } from "../components/sections/CTA"

export function Home() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <Hero onNavigatePlanner={() => navigate("/planner")} />
      
      {/* View Demo CTA button redirect hook (injectable using direct page click binding if required) */}
      <div className="bg-slate-50 dark:bg-slate-950 pb-16 flex justify-center gap-4">
        <button 
          onClick={() => navigate("/dashboard")}
          className="text-xs font-extrabold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 uppercase tracking-widest cursor-pointer focus:outline-none"
        >
          View System Control Demo ➔
        </button>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <button 
          onClick={() => navigate("/trip/1/logs")}
          className="text-xs font-extrabold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 uppercase tracking-widest cursor-pointer focus:outline-none"
        >
          View Driver Logs ➔
        </button>
      </div>

      <Statistics />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Testimonials />
      <CTA onNavigatePlanner={() => navigate("/planner")} />
    </PageContainer>
  )
}
