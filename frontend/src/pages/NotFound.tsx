import { useNavigate } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { Button } from "../components/ui/button"
import { Truck, ArrowLeft, Navigation } from "lucide-react"

export function NotFound() {
  const navigate = useNavigate()

  return (
    <PageContainer className="bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center py-24">
      <div className="container max-w-xl mx-auto px-4 text-center space-y-8 flex flex-col items-center">
        
        {/* Animated 404 graphic */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
          
          <div className="relative h-28 w-28 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-950 rounded-full flex items-center justify-center shadow-xl">
            <Truck className="h-12 w-12 text-blue-600 dark:text-blue-500 animate-bounce" />
          </div>

          <div className="absolute -top-2 -right-2 h-7 w-7 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-lg">
            404
          </div>
        </div>

        {/* Informative text */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Route Not Found
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 font-semibold leading-relaxed max-w-[400px] mx-auto">
            The coordinates you requested are off the commercial grid or the HOS timeline has expired. Let's recalculate your route.
          </p>
        </div>

        {/* Redirect action buttons */}
        <div className="flex flex-wrap justify-center gap-3 w-full">
          <Button 
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 text-xs font-bold rounded-xl flex items-center gap-2 shadow"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/planner")}
            className="h-11 px-6 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900 flex items-center gap-2"
          >
            <Navigation className="h-4 w-4 text-blue-500" /> Start Re-planning
          </Button>
        </div>

      </div>
    </PageContainer>
  )
}
