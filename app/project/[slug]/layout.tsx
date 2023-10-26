"use client"
import { ProjectContextProvider } from "@/components/contexts/ProjectContextState";

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    slug: string
  }
}) {
  return (
    <ProjectContextProvider projectId={params.slug}>
      {children}
    </ProjectContextProvider>
  );
}