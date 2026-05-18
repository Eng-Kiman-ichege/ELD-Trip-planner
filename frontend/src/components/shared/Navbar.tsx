import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Truck, Menu, X } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { api } from "../../lib/api"

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navLinks: { to: string; label: string; end?: boolean }[] = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/planner", label: "Planner" },
    { to: "/about", label: "About" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/70 transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* Brand Logo Link */}
        <Link to="/" className="flex items-center gap-2 focus:outline-none z-50">
          <Truck className="h-6 w-6 text-blue-600 dark:text-blue-500 animate-pulse-slow" />
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-450 dark:to-indigo-400 bg-clip-text text-transparent">
            RouteELD
          </span>
        </Link>
        
        {/* Navigation Middle Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-xs font-extrabold tracking-wider uppercase transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive ? "text-blue-600 dark:text-blue-400 font-black border-b-2 border-blue-600 dark:border-blue-400 pb-0.5" : "text-slate-500 dark:text-slate-400"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        
        {/* Right Nav Options */}
        <div className="flex items-center gap-3">
          
          {/* Reusable Theme Toggle Switcher */}
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

          {api.auth.isAuthenticated() ? (
            <>
              <Button 
                variant="ghost" 
                className="hidden sm:inline-flex text-xs font-bold text-slate-650 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 rounded-xl"
                onClick={() => {
                  api.auth.logout();
                  navigate("/");
                  window.location.reload();
                }}
              >
                Sign Out
              </Button>

              <Button 
                onClick={() => navigate("/planner")}
                className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/15 h-10 px-4 text-xs font-extrabold rounded-xl transition-all"
              >
                Start Planning
              </Button>

              {/* User profile avatar */}
              <div 
                onClick={() => navigate("/dashboard")}
                title={`Logged in as ${api.auth.getUserEmail()}`}
                className="hidden sm:flex h-10 w-10 border border-slate-200 dark:border-slate-800 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl items-center justify-center text-xs font-bold text-white shadow shadow-indigo-500/10 cursor-pointer"
              >
                {api.auth.getUserInitials()}
              </div>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="hidden sm:inline-flex text-xs font-bold text-slate-650 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 rounded-xl"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>

              <Button 
                onClick={() => navigate("/login")}
                className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/15 h-10 px-4 text-xs font-extrabold rounded-xl transition-all"
              >
                Start Planning
              </Button>
            </>
          )}

          {/* Responsive Hamburger Mobile Toggle Button (Visible only on lg down) */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none transition cursor-pointer z-50"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

        </div>

      </div>

      {/* Responsive Mobile Menu Drawer Dropdown overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top duration-300 z-40">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4 font-semibold text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center py-2 border-b border-slate-100/60 dark:border-slate-850 transition-colors uppercase tracking-wider text-[11px] font-extrabold ${
                    isActive ? "text-blue-600 dark:text-blue-400 font-black border-l-4 border-l-blue-500 pl-3" : "text-slate-600 dark:text-slate-455 pl-1 hover:text-blue-500"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="flex flex-col gap-3 mt-4">
              {api.auth.isAuthenticated() ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-800"
                    onClick={() => {
                      setIsMenuOpen(false);
                      api.auth.logout();
                      navigate("/");
                      window.location.reload();
                    }}
                  >
                    Sign Out ({api.auth.getUserEmail()})
                  </Button>
                  <Button 
                    className="w-full h-11 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/planner");
                    }}
                  >
                    Start Planning
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-800"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full h-11 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    Start Planning
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
