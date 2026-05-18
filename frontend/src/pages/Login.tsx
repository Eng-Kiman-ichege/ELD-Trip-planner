import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { api } from "../lib/api"
import { ShieldCheck, Truck, KeyRound, User, Loader2, AlertCircle } from "lucide-react"

export function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Show notification if redirected due to session expiration
  const isSessionExpired = searchParams.get("expired") === "true"

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard directly
    if (api.auth.isAuthenticated()) {
      navigate("/dashboard")
    }
  }, [navigate])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Please enter both username and password.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await api.auth.login(username, password)
      // On success, redirect directly to the Control Center
      navigate("/dashboard")
      // Force reload to sync navbar states
      window.location.reload()
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Pre-filled single click helper to bypass credentials for सेफ्टी auditor
  const handleAuditorBypass = async () => {
    setIsLoading(true)
    setError(null)
    
    const auditorUser = "safety_auditor"
    const auditorPass = "SecurePassword123"
    
    setUsername(auditorUser)
    setPassword(auditorPass)

    try {
      await api.auth.login(auditorUser, auditorPass)
      navigate("/dashboard")
      window.location.reload()
    } catch (err: any) {
      setError(err.message || "Failed to login automatically. Please verify your Django server is running.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer className="bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-md relative z-10 px-4">
        
        {/* Decorative background glows */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 dark:bg-blue-550/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-550/15 rounded-full blur-3xl pointer-events-none"></div>

        <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 shadow-2xl backdrop-blur-md rounded-3xl overflow-hidden">
          
          <CardHeader className="border-b border-slate-100 dark:border-slate-850 p-6 text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
              <Truck className="h-6 w-6 animate-pulse-slow" />
            </div>
            <CardTitle className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Access RouteELD Room
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-slate-500">
              Sign in to manage HOS logs and dispatch trucking schedules.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            
            {/* Session expiration warning notification */}
            {isSessionExpired && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400 rounded-xl flex items-start gap-2.5 text-xs font-semibold leading-normal">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <p>Your session has expired. Please sign in again to access the dashboard pages.</p>
              </div>
            )}

            {/* Error panel */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 rounded-xl flex items-start gap-2.5 text-xs font-semibold leading-normal">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="safety_auditor"
                    className="w-full h-11 pl-11 pr-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all text-slate-800 dark:text-slate-100"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-11 pr-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all text-slate-800 dark:text-slate-100"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing In...
                  </>
                ) : (
                  "Authenticate"
                )}
              </Button>

            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-150 dark:border-slate-850"></div>
              <span className="flex-shrink mx-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">or Quick Access</span>
              <div className="flex-grow border-t border-slate-150 dark:border-slate-850"></div>
            </div>

            {/* Safety Auditor Single-Click Bypass Option */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleAuditorBypass}
                className="w-full h-11 bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer"
                disabled={isLoading}
              >
                <ShieldCheck className="h-4.5 w-4.5" />
                Auditor One-Click Login
              </button>
              
              <p className="text-[10px] text-center text-slate-400 font-semibold leading-normal">
                Bypasses credentials and authenticates directly as the predefined auditor account. Recommended for swift inspections!
              </p>
            </div>

          </CardContent>
          
        </Card>

      </div>
    </PageContainer>
  )
}
