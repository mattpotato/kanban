"use client"
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";

interface ProjectCardProps {
  project: Project
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/project/${project.id}`);
  }
  return <button className="w-80 border rounded-sm p-2 flex flex-1 justify-center items-center shadow-md hover:bg-gray-200 transition duration-300 ease-in-out text-lg" onClick={handleClick}>
    {project.title}
  </button>
}


export default function ProjectList() {
const [projects, setProjects] = useState<Project[]>([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const loadProjects = async () => {
      const { data } = await supabase.from("project").select();
      if (data) {
        setProjects(data);
      }
      else {
        console.error("Error fetching projects")
      }
    }
    loadProjects();
  }, [])

  const createProject = async () => {
    const res = await supabase.from("project").insert({
      title: "Untitled Project",
      creator_id: (await supabase.auth.getUser()).data.user?.id,
    }).select();

    if (res.data?.length) {
      router.push(`/project/${res.data[0].id}`);
    }
  }

  return (
    <div className="flex gap-4 items-center">
      <div className="flex gap-4">
        {projects.map((project) => {
          return <ProjectCard key={project.id} project={project} />
        })}
      </div>
      <button className="h-14 border rounded-sm p-2 flex items-center gap-2 hover:bg-gray-200 transition duration-300 ease-in-out" onClick={createProject}>
        <FaPlus size={16}/>
        Create project
        </button>
    </div>
  )
}
