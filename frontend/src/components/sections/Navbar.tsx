import { Button } from "../ui/button"
import { Truck } from "lucide-react"

interface NavbarProps {
  onNavigatePlanner: () => void;
  onNavigateHome: () => void;
  page: "home" | "planner";
}

export function Navbar({ onNavigatePlanner, onNavigateHome, page }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
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
              page === "planner" ? "text-blue-600 dark:text-blue-500 font-semibold" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
            }`}
          >
            Planner
          </button>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">Logs</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">About</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
          <Button onClick={onNavigatePlanner}>Start Planning</Button>
        </div>
      </div>
    </nav>
  )
}
