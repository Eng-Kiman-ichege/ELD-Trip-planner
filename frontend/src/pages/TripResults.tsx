import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { ResultsDashboard } from "../components/results/ResultsDashboard"
import { Loader2 } from "lucide-react"
import { api } from "../lib/api"

export function TripResults() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    async function fetchTrip() {
      try {
        setIsLoading(true)
        const data = await api.trips.get(id!)
        setTrip(data)
      } catch (err: any) {
        setError(err.message || "Failed to load trip details.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrip()
  }, [id])

  if (isLoading) {
    return (
      <PageContainer className="bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading Trip Route Details...</p>
        </div>
      </PageContainer>
    )
  }

  if (error || !trip) {
    return (
      <PageContainer className="bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Trip Not Found</p>
          <p className="text-sm text-slate-500">{error || "This trip record doesn't exist in the database."}</p>
          <button
            onClick={() => navigate("/planner")}
            className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all"
          >
            Plan a New Trip
          </button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <ResultsDashboard
        trip={trip}
        tripId={id!}
        onNavigatePlanner={() => navigate("/planner")}
        onNavigateHome={() => navigate("/")}
      />
    </PageContainer>
  )
}
