import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { 
  ShieldCheck, Info, Sparkles, Map, Database, Brain, Globe, 
  HelpCircle, ChevronDown, Award, PlayCircle 
} from "lucide-react"

export function About() {
  const navigate = useNavigate()

  // State to track accordion active items
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null)

  const faqs = [
    {
      q: "What is RouteELD?",
      a: "RouteELD is a state-of-the-art trucking logistics planner designed to help truck dispatchers and commercial drivers plan optimal, compliant long-distance trips. By integrating real-time OpenStreetMap routing engine overlays with FMCSA Hours of Service rules, the platform helps prevent costly compliance logs violations before drivers start their trucks."
    },
    {
      q: "How does the compliance engine calculate stops?",
      a: "Our compliance engine tracks driving hours, active duty durations, and multi-day cycles in real-time. If a planned route segment exceeds the 11-hour driving limit or the 14-hour daily duty window, the planner automatically schedules mandatory rest breaks or 10-hour sleeper berth overnight stops, completely eliminating manual calculations."
    },
    {
      q: "Is RouteELD an officially certified ELD device?",
      a: "RouteELD simulates ELD daily logs and schedule timelines for demo, pre-trip planning, and dispatcher training purposes. For active driver duty tracking, it integrates directly with certified FMCSA hardware vendors to sync records."
    },
    {
      q: "How is fuel optimization computed?",
      a: "The optimizer models your fuel tank capacity, average loaded MPG estimation, and location of national travel plazas (e.g. Loves, Pilot). It calculates optimal fuel top-offs at stop areas that present lowest local fuel prices to minimize logistics costs."
    }
  ]

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx)
  }

  return (
    <PageContainer className="bg-slate-50 dark:bg-slate-950">
      <div className="container relative mx-auto px-4 md:px-6 space-y-16">
        
        {/* A. Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6 pt-8">
          <Badge className="bg-blue-600/90 text-white border-0 flex items-center gap-1.5 h-6 text-[10px] uppercase font-bold tracking-wider px-3 rounded-full w-fit mx-auto">
            <Award className="h-3.5 w-3.5" /> Industry Abstraction Layer
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-slate-50">
            About <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-450 dark:to-indigo-400 bg-clip-text text-transparent">RouteELD</span>
          </h1>
          <p className="max-w-[700px] text-lg sm:text-xl text-slate-650 dark:text-slate-400 mx-auto leading-relaxed">
            AI-powered trucking route planning and ELD compliance simulation platform designed for drivers and dispatchers.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="h-12 px-8 text-xs font-bold rounded-xl" onClick={() => navigate("/planner")}>
              Start Planning
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900" onClick={() => navigate("/dashboard")}>
              Open Dashboard
            </Button>
          </div>
        </div>

        {/* B. Platform Overview */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">AI Platform Capabilities</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 font-bold uppercase tracking-wider">Features engineered for compliance safety</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
                <Map className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Route Optimization</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">Optimal interstate paths avoiding traffic gridlocks and narrow truck lanes.</p>
            </Card>

            <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">HOS Calculations</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">Real-time driver HOS clock tracking mapping 11h, 14h, 30m, and 70h rules.</p>
            </Card>

            <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">ELD Log Simulator</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">Render federal 24h DOT grid activity tracks with complete details.</p>
            </Card>

            <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Fuel stops optimization</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">Find lowest local diesel prices to save significant long-haul logistics costs.</p>
            </Card>

            <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center">
                <Info className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Driver Scheduling</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">Accurate arrival predictions factoring in mandatory sleeper resets.</p>
            </Card>
          </div>
        </div>

        {/* C. FMCSA Hours of Service Rules Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">FMCSA Hours of Service (HOS) Regulations</h3>
            <p className="text-xs text-slate-550 dark:text-slate-450 font-bold uppercase tracking-wider">Federal guidelines that structure our HOS optimizer</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Card className="border-t-4 border-t-blue-500 border border-slate-200/50 bg-white/70 dark:bg-slate-950/70 p-6 rounded-2xl space-y-3">
              <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">11-Hour Driving Rule</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                A driver may drive a maximum of 11 hours after 10 consecutive hours off-duty. Exceeding this triggers automated alerts.
              </p>
            </Card>

            <Card className="border-t-4 border-t-indigo-500 border border-slate-200/50 bg-white/70 dark:bg-slate-950/70 p-6 rounded-2xl space-y-3">
              <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">14-Hour Windows Rule</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                A driver may not drive beyond the 14th consecutive hour after coming on duty. Crucial for scheduling terminals and checkouts.
              </p>
            </Card>

            <Card className="border-t-4 border-t-emerald-500 border border-slate-200/50 bg-white/70 dark:bg-slate-950/70 p-6 rounded-2xl space-y-3">
              <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">30-Minute Break Rule</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                A driver must take a 30-minute off-duty break after 8 hours of driving. The planner auto-schedules rest oases.
              </p>
            </Card>

            <Card className="border-t-4 border-t-amber-500 border border-slate-200/50 bg-white/70 dark:bg-slate-950/70 p-6 rounded-2xl space-y-3">
              <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">70-Hour / 8-Day Rule</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                A driver may not drive after accumulating 70 hours of active duty in any 8-day rolling window. Resets with a 34h sleep.
              </p>
            </Card>
          </div>
        </div>



        {/* E. How Route Calculations Work */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">How Route Calculations Work</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 font-bold uppercase tracking-wider">Step-by-step dispatch pipeline explanation</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-6 rounded-2xl shadow-sm space-y-3">
              <div className="text-xs font-black text-blue-500">STEP 01</div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Route Generation</h4>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
                Takes pickup and dropoff points to trace interstate lines across highway pathways, avoiding toll gates where requested.
              </p>
            </Card>

            <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-6 rounded-2xl shadow-sm space-y-3">
              <div className="text-xs font-black text-indigo-500">STEP 02</div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Compliance & Fuel Allocation</h4>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
                Audits the driver's active daily clocks to insert mandatory rest and fuel stops before any violation thresholds are reached.
              </p>
            </Card>

            <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-6 rounded-2xl shadow-sm space-y-3">
              <div className="text-xs font-black text-emerald-500">STEP 03</div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">ELD Log compilation</h4>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
                Exports optimized dispatch parameters directly to DOT compliance timelines and driver terminal records.
              </p>
            </Card>
          </div>
        </div>

        {/* F. Dashboard Preview Section */}
        <div className="p-8 border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-xl">
          <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <PlayCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Experience RouteELD Control Dashboards</h4>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
              Take a walk inside our mock logistics control centers to review interactive SVG route charts, active checklists, and driver timelines.
            </p>
          </div>
          <Button className="h-10 px-6 text-xs font-bold rounded-xl md:ml-auto" onClick={() => navigate("/dashboard")}>
            Try Demo Dashboard
          </Button>
        </div>

        {/* G. FAQ Section (Accordion) */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 font-bold uppercase tracking-wider">Quick answers to platform mechanics</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx
              return (
                <Card 
                  key={idx} 
                  className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 rounded-2xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm font-extrabold text-slate-850 dark:text-slate-200 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-blue-500 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-850 pt-3 text-xs leading-relaxed text-slate-550 dark:text-slate-400 font-semibold">
                      {faq.a}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

      </div>
    </PageContainer>
  )
}
