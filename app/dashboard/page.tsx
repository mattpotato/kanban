import ProjectList from "@/components/ProjectList"
import { DashboardContextProvider } from "@/components/contexts/DashboardContextState"

export default function Dashboard() {
  return <div className="flex flex-col gap-4 px-4">
    <p className="text-lg font-bold">Projects</p>
    <DashboardContextProvider>
      <ProjectList />
    </DashboardContextProvider>
  </div>
}