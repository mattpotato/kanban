"use client"
import { createClient } from "@/utils/supabase/client";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { FaEllipsis, FaPlus } from "react-icons/fa6";
import { useDashboardContext } from "./contexts/DashboardContextState";

interface ProjectCardProps {
  project: Project
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/project/${project.id}`);
  }
    return <div className="w-80 min-h-[10rem] border rounded-sm p-2 flex flex-1 justify-center items-center shadow-md hover:bg-gray-200 transition duration-300 ease-in-out text-lg relative cursor-pointer" onClick={handleClick}>
    <div>{project.title}</div>
    <div className="absolute top-2 right-2">
      <ProjectCardDropdown projectId={project.id}/>
    </div>
  </div>
}

interface DropdownProps {
  projectId: string
}
const ProjectCardDropdown: React.FC<DropdownProps> = ({ projectId }) => {
  const supabase = createClient();
  const { setProjects } = useDashboardContext();

  const handleDelete = async (e : React.MouseEvent) => {
    e.stopPropagation();
    const { data, error } = await supabase.from("project").delete().eq("id", projectId).select();
    if (data?.length) {
      setProjects((prev) => {
        const newProjects = [...prev];
        return newProjects.filter((project) => project.id !== projectId);
      });
    }
  }

  return (
    <div className="relative flex-grow-0 flex self-start">
      <Menu>
        <Menu.Button onClick={(e) => e.stopPropagation()}>
          <div className="h-[30px] w-[30px] rounded-full flex justify-center items-center hover:bg-gray-400">
            <FaEllipsis className="rounded" size={24} />
          </div>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="flex flex-col absolute top-full bg-white rounded border border-gray-400 p-2 w-40 cursor-pointer z-50">
            <Menu.Item>
              {({ active }) => (
                <a
                  className={`${active && 'bg-gray-200'} p-1 text-start`}
                  onClick={handleDelete}
                >
                  Delete
                </a>
              )}
            </Menu.Item>
          </Menu.Items>

        </Transition>
      </Menu>
    </div>
  )
}


export default function ProjectList() {
  const  { projects, createProject } = useDashboardContext();

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
