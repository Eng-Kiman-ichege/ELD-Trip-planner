import { Link, NavLink, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Truck } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/70 transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* Brand Logo Link */}
        <Link to="/" className="flex items-center gap-2 focus:outline-none">
          <Truck className="h-6 w-6 text-blue-600 dark:text-blue-500 animate-pulse-slow" />
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-450 dark:to-indigo-400 bg-clip-text text-transparent">
            RouteELD
          </span>
        </Link>
        
        {/* Navigation Middle Links */}
        <div className="hidden lg:flex items-center gap-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-xs font-extrabold tracking-wider uppercase transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive ? "text-blue-600 dark:text-blue-400 font-black border-b-2 border-blue-600 dark:border-blue-400 pb-0.5" : "text-slate-500 dark:text-slate-400"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/planner"
            className={({ isActive }) =>
              `text-xs font-extrabold tracking-wider uppercase transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive ? "text-blue-600 dark:text-blue-400 font-black border-b-2 border-blue-600 dark:border-blue-400 pb-0.5" : "text-slate-500 dark:text-slate-400"
              }`
            }
          >
            Planner
          </NavLink>
          <NavLink
            to="/trip/1"
            end
            className={({ isActive }) =>
              `text-xs font-extrabold tracking-wider uppercase transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive ? "text-blue-600 dark:text-blue-400 font-black border-b-2 border-blue-600 dark:border-blue-400 pb-0.5" : "text-slate-500 dark:text-slate-400"
              }`
            }
          >
            Trip Results
          </NavLink>
          <NavLink
            to="/trip/1/logs"
            className={({ isActive }) =>
              `text-xs font-extrabold tracking-wider uppercase transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive ? "text-blue-600 dark:text-blue-400 font-black border-b-2 border-blue-600 dark:border-blue-400 pb-0.5" : "text-slate-500 dark:text-slate-400"
              }`
            }
          >
            Logs
          </NavLink>
          <NavLink
            to="/trip/1/stops"
            className={({ isActive }) =>
              `text-xs font-extrabold tracking-wider uppercase transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive ? "text-blue-600 dark:text-blue-400 font-black border-b-2 border-blue-600 dark:border-blue-400 pb-0.5" : "text-slate-500 dark:text-slate-400"
              }`
            }
          >
            Stops Timeline
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-xs font-extrabold tracking-wider uppercase transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive ? "text-blue-600 dark:text-blue-400 font-black border-b-2 border-blue-600 dark:border-blue-400 pb-0.5" : "text-slate-500 dark:text-slate-400"
              }`
            }
          >
            About
          </NavLink>
        </div>
        
        {/* Right Nav Options */}
        <div className="flex items-center gap-3.5">
          
          {/* Reusable Theme Toggle Switcher */}
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

          <Button 
            variant="ghost" 
            className="hidden sm:inline-flex text-xs font-bold text-slate-650 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 rounded-xl"
            onClick={() => navigate("/dashboard")}
          >
            Sign In
          </Button>

          <Button 
            onClick={() => navigate("/planner")}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/15 h-10 px-4 text-xs font-extrabold rounded-xl transition-all"
          >
            Start Planning
          </Button>

          {/* User profile avatar */}
          <div className="h-10 w-10 border border-slate-200 dark:border-slate-800 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow shadow-indigo-500/10 cursor-pointer">
            JD
          </div>

        </div>

      </div>
    </nav>
  )
}
