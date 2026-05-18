import { useState } from "react"
import { TripForm } from "../planner/TripForm"
import type { TripFormData } from "../planner/TripForm"
import { LivePreview } from "../planner/LivePreview"
import { TripTimeline } from "../planner/TripTimeline"
import type { Stop } from "../planner/TripTimeline"
import { ComplianceStatus } from "../planner/ComplianceStatus"
import type { RuleStatus } from "../planner/ComplianceStatus"
import { SmartInsights } from "../planner/SmartInsights"
import type { Insight } from "../planner/SmartInsights"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { ShieldCheck, Route, FileSpreadsheet, PlayCircle, ArrowLeft } from "lucide-react"

// Mock calculated stops based on full trip generation
const initialStops: Stop[] = [
  { name: "Dallas, TX", type: "start", mile: 0 },
  { name: "Loves Travel Stop", type: "fuel", mile: 240 },
  { name: "Pilot Travel Center", type: "rest", mile: 480 },
  { name: "Atlanta Rest Stop", type: "sleep", mile: 720 },
  { name: "Miami, FL", type: "end", mile: 1180 }
]

// Mock compliance rules checks
const initialRules: RuleStatus[] = [
  { name: "11-Hour Driving Rule", limit: "11:00 hrs", used: "08:45 hrs", status: "compliant", description: "You have 2 hours and 15 minutes of driving time left today." },
  { name: "14-Hour On-Duty Window", limit: "14:00 hrs", used: "10:30 hrs", status: "compliant", description: "Your daily active duty window is fully compliant." },
  { name: "70-Hour / 8-Day Cycle", limit: "70:00 hrs", used: "22:00 hrs", status: "compliant", description: "Driver has abundant cycle hours remaining for the trip." },
  { name: "30-Min Rest Break", limit: "8:00 hrs limit", used: "4:15 hrs since break", status: "warning", description: "A mandatory 30-minute break is due in 3 hours and 45 minutes." }
]

// Mock AI smart insights
const initialInsights: Insight[] = [
  { text: "Trip requires 2 overnight rest cycles.", type: "info" },
  { text: "Fuel stop recommended near Atlanta, GA.", type: "fuel" },
  { text: "Driver cycle remaining after trip: 12.5 hours.", type: "rest" },
  { text: "30-minute mandatory break required after 8 driving hours.", type: "warning" }
]

interface TripPlannerProps {
  onNavigateHome: () => void;
  onNavigateResults: (id: number) => void;
}

export function TripPlanner({ onNavigateHome, onNavigateResults }: TripPlannerProps) {
  const [formData, setFormData] = useState<TripFormData | null>(null)
  const [stops, setStops] = useState<Stop[]>(initialStops)
  const [rules, setRules] = useState<RuleStatus[]>(initialRules)
  const [insights, setInsights] = useState<Insight[]>(initialInsights)

  // Triggered when form fields change in real-time
  const handleFormChange = (data: TripFormData) => {
    setFormData(data)
  }

  // Triggered on form submit click (Generate Plan)
  const handleFormSubmit = (response: any) => {
    // Jump straight to Results page showing full charts and interactive maps using the DB-seeded trip ID!
    onNavigateResults(response.id)
  }

  return (
    <div className="relative overflow-hidden bg-slate-50 min-h-screen py-12 dark:bg-slate-950 transition-colors duration-300">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <div className="container relative mx-auto px-4 md:px-6 space-y-12">
        
        {/* Navigation back button */}
        <div>
          <button onClick={onNavigateHome} className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
        </div>

        {/* Planner Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-[700px]">
            <Badge variant="secondary" className="inline-flex">
              <ShieldCheck className="mr-1 h-3 w-3" /> Core Planner
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
              Plan Your Next Trucking Route
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
              Generate optimized routes, compliant driving schedules, rest breaks, fuel stops, and ELD logs instantly.
            </p>
          </div>
          
          {/* Floating Analytics Mini Badge */}
          <Card className="max-w-[240px] shadow-md border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 backdrop-blur-md self-start md:self-center">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Route className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Plan Safety</p>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">100% Audited</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Planner Two-Column Layout */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column — Form */}
          <div className="lg:col-span-7 space-y-6">
            <TripForm 
              onChange={handleFormChange}
              onSubmit={handleFormSubmit}
            />
          </div>

          {/* Right Column — Live Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            {formData && (
              <LivePreview formData={formData} />
            )}
          </div>

        </div>

        {/* Smart Insights Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-150">AI-Powered Compliance Insights</h3>
          </div>
          <SmartInsights insights={insights} />
        </div>

        {/* Trip Summary Timeline */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-150">Optimal Log Sequence Timeline</h3>
          </div>
          <Card className="border border-slate-200/50 bg-white/70 dark:border-slate-800/50 dark:bg-slate-950/70 p-6 rounded-2xl">
            <TripTimeline stops={stops} />
          </Card>
        </div>

        {/* Compliance Status Rule gauges */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-150">Hours of Service Compliance Checklist</h3>
          </div>
          <ComplianceStatus rules={rules} />
        </div>

      </div>
    </div>
  )
}
