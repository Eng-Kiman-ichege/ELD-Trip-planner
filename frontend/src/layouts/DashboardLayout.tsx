import { ReactNode, useState, useEffect } from "react"
import { Navbar } from "../components/shared/Navbar"
import { Truck } from "lucide-react"
import { Link } from "react-router-dom"

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isDark, setIsDark] = useState(false)

  // Sync theme with localStorage and root element on mount
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

  // Toggle theme action
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300 font-sans">
      
      {/* Dynamic background canvas grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>
      
      {/* Unifed Navbar */}
      <Navbar isDark={isDark} onToggleTheme={handleToggleTheme} />

      {/* Main Body Children */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Unified Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Truck className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-bold tracking-tight">RouteELD</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                AI-powered logistics SaaS platform making Hours of Service compliance and complex route planning effortless for the modern trucking industry.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/planner" className="hover:text-white transition-colors">Route Planner</Link></li>
                <li><Link to="/trip/1/logs" className="hover:text-white transition-colors">ELD Daily Logs</Link></li>
                <li><Link to="/trip/1" className="hover:text-white transition-colors">Compliance Engine</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Safety Blog</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              </div>
              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()} RouteELD Inc. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </footer>

    </div>
  )
}
