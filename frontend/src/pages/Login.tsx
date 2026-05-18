import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { api } from "../lib/api"
import { Truck, KeyRound, Mail, Loader2, AlertCircle, Building2, CheckCircle2 } from "lucide-react"

type Mode = "login" | "signup"

export function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<Mode>("login")

  // Form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [companyName, setCompanyName] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isSessionExpired = searchParams.get("expired") === "true"

  useEffect(() => {
    if (api.auth.isAuthenticated()) navigate("/dashboard")
  }, [navigate])

  // Reset form state when switching modes
  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
    setSuccess(null)
    setPassword("")
    setConfirmPassword("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError("Please enter your email and password."); return }
    setIsLoading(true); setError(null)
    try {
      await api.auth.login(email, password)
      navigate("/dashboard")
      window.location.reload()
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError("Email and password are required."); return }
    if (password !== confirmPassword) { setError("Passwords do not match."); return }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return }
    setIsLoading(true); setError(null)
    try {
      await api.auth.register(email, password, companyName)
      setSuccess("Account created! Signing you in...")
      // Auto-login after registration
      await api.auth.login(email, password)
      navigate("/dashboard")
      window.location.reload()
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <PageContainer className="bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10 px-4">
        {/* Glow blobs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 shadow-2xl backdrop-blur-md rounded-3xl overflow-hidden">

          {/* Header */}
          <CardHeader className="border-b border-slate-100 dark:border-slate-850 p-6 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                RouteELD Platform
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-slate-500 mt-1">
                {mode === "login" ? "Sign in to manage HOS logs and dispatch schedules." : "Create your free operations account."}
              </CardDescription>
            </div>

            {/* Mode toggle tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 h-9 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`flex-1 h-9 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  mode === "signup"
                    ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Create Account
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-5">

            {/* Session-expired notice */}
            {isSessionExpired && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-800/30 dark:text-amber-400 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>Your session expired. Please sign in again.</p>
              </div>
            )}

            {/* Success banner */}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800/30 dark:text-emerald-400 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{success}</p>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-800/30 dark:text-red-400 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* ─── SIGN IN FORM ─── */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full h-11 pl-11 pr-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all text-slate-800 dark:text-slate-100"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-11 pl-11 pr-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all text-slate-800 dark:text-slate-100"
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md flex items-center justify-center gap-2" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing In...</> : "Sign In"}
                </Button>


                <p className="text-[10px] text-center text-slate-400 font-semibold">
                  No account yet?{" "}
                  <button type="button" onClick={() => switchMode("signup")} className="text-blue-500 hover:underline font-bold cursor-pointer">
                    Create one for free →
                  </button>
                </p>
              </form>
            )}

            {/* ─── SIGN UP FORM ─── */}
            {mode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Email Address <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full h-11 pl-11 pr-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all text-slate-800 dark:text-slate-100"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Company / Carrier Name <span className="text-slate-300">(optional)</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="RouteELD Logistics Inc."
                      className="w-full h-11 pl-11 pr-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all text-slate-800 dark:text-slate-100"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Password <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full h-11 pl-11 pr-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all text-slate-800 dark:text-slate-100"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Confirm Password <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full h-11 pl-11 pr-4 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 transition-all text-slate-800 dark:text-slate-100 dark:bg-slate-900 ${
                        confirmPassword && confirmPassword !== password
                          ? "border-red-400 focus:ring-red-400/50"
                          : "border-slate-200 dark:border-slate-800 focus:ring-blue-500/80"
                      }`}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md flex items-center justify-center gap-2 mt-2" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating Account...</> : "Create Account & Sign In"}
                </Button>

                <p className="text-[10px] text-center text-slate-400 font-semibold">
                  Already have an account?{" "}
                  <button type="button" onClick={() => switchMode("login")} className="text-blue-500 hover:underline font-bold cursor-pointer">
                    Sign in →
                  </button>
                </p>
              </form>
            )}

          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
