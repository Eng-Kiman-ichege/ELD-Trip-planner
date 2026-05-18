import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DashboardLayout } from "../layouts/DashboardLayout"
import { Home } from "../pages/Home"
import { Planner } from "../pages/Planner"
import { TripResults } from "../pages/TripResults"
import { EldLogs } from "../pages/EldLogs"
import { TripStops } from "../pages/TripStops"
import { About } from "../pages/About"
import { Dashboard } from "../pages/Dashboard"
import { NotFound } from "../pages/NotFound"

export function AppRouter() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/trip/:id" element={<TripResults />} />
          <Route path="/trip/:id/logs" element={<EldLogs />} />
          <Route path="/trip/:id/stops" element={<TripStops />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  )
}
