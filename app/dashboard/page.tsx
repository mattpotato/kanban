import ProjectList from "@/components/ProjectList"

export default function Dashboard() {
  return <div className="flex flex-col gap-4">
    <p className="text-lg">Projects</p>
    <ProjectList />
  </div>
}