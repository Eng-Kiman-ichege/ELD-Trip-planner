import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { DashboardLayout } from "../layouts/DashboardLayout"
import { Home } from "../pages/Home"
import { Planner } from "../pages/Planner"
import { TripResults } from "../pages/TripResults"
import { EldLogs } from "../pages/EldLogs"
import { TripStops } from "../pages/TripStops"
import { About } from "../pages/About"
import { Dashboard } from "../pages/Dashboard"
import { Login } from "../pages/Login"
import { NotFound } from "../pages/NotFound"
import { api } from "../lib/api"

// Router guard to redirect unauthenticated users to the login screen
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!api.auth.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Strict Protected Routes */}
          <Route path="/planner" element={
            <ProtectedRoute>
              <Planner />
            </ProtectedRoute>
          } />
          <Route path="/trip/:id" element={
            <ProtectedRoute>
              <TripResults />
            </ProtectedRoute>
          } />
          <Route path="/trip/:id/logs" element={
            <ProtectedRoute>
              <EldLogs />
            </ProtectedRoute>
          } />
          <Route path="/trip/:id/stops" element={
            <ProtectedRoute>
              <TripStops />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  )
}

