import { Sun, Moon } from "lucide-react"

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="h-10 w-10 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl flex items-center justify-center backdrop-blur-md transition-all shadow-sm cursor-pointer focus:outline-none"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-500 animate-spin-slow" />
      ) : (
        <Moon className="h-5 w-5 text-slate-650" />
      )}
    </button>
  )
}
