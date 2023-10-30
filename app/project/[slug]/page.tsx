import Board from "@/components/Board";
import { ProjectContextProvider } from "@/components/contexts/ProjectContextState";

export default function Page({ params }: { params: { slug: string } }) {
  return <ProjectContextProvider projectId={params.slug}>
    <Board projectId={params.slug}/>
  </ProjectContextProvider>
}