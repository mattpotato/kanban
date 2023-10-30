"use client" 
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { SetStateAction, createContext, useContext, useEffect, useState } from "react";

// Define the type for the context's data
interface DashboardState {
  // Your data structure here
  projects: Project[]
  setProjects: React.Dispatch<SetStateAction<Project[]>>;
  createProject: () => void;
}

// Create the context
const DashboardContext = createContext<DashboardState | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const DashboardContextProvider: React.FC<Props> = ({ children }) => {
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

  const data: DashboardState = {
    // Your data
    projects,
    setProjects,
    createProject,
  };

  return <DashboardContext.Provider value={data}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
