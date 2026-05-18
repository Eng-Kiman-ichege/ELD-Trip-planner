import { useNavigate } from "react-router-dom"
import { PageContainer } from "../layouts/PageContainer"
import { TripPlanner } from "../components/pages/TripPlanner"

export function Planner() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <TripPlanner 
        onNavigateHome={() => navigate("/")} 
        onNavigateResults={() => navigate("/trip/1")} 
      />
    </PageContainer>
  )
}
