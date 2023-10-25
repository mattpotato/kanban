import ProjectList from "@/components/ProjectList"

export default function Dashboard() {
  return <div className="p-4 bg-green-300 flex-1 h-full max-w-full">
    Projects
    <ProjectList />
  </div>
}