import { Button } from "../ui/button"
import { Truck, Sun, Moon } from "lucide-react"

interface NavbarProps {
  onNavigatePlanner: () => void;
  onNavigateHome: () => void;
  page: "home" | "planner" | "results";
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Navbar({ onNavigatePlanner, onNavigateHome, page, isDark, onToggleTheme }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <button onClick={onNavigateHome} className="flex items-center gap-2 cursor-pointer focus:outline-none">
          <Truck className="h-6 w-6 text-blue-600 dark:text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">RouteELD</span>
        </button>
        
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={onNavigateHome}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              page === "home" ? "text-blue-600 dark:text-blue-500 font-semibold" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
            }`}
          >
            Home
          </button>
          <button
            onClick={onNavigatePlanner}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              page === "planner" || page === "results" ? "text-blue-600 dark:text-blue-500 font-semibold" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
            }`}
          >
            Planner
          </button>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">Logs</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">About</a>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Light/Dark mode Sun/Moon persistent toggler */}
          <button
            onClick={onToggleTheme}
            className="h-10 w-10 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl flex items-center justify-center backdrop-blur-md transition-all shadow-sm cursor-pointer focus:outline-none"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
          </button>

          <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
          <Button onClick={onNavigatePlanner}>Start Planning</Button>
        </div>
      </div>
    </nav>
  )
}
