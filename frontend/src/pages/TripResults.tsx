import { useNavigate } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { ResultsDashboard } from "../components/results/ResultsDashboard"

export function TripResults() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <ResultsDashboard 
        onNavigatePlanner={() => navigate("/planner")}
        onNavigateHome={() => navigate("/")}
      />
    </PageContainer>
  )
}
