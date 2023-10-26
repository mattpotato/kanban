"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useContext, useEffect, useState } from "react";

export interface ListWithTaskIds extends TaskList {
  taskIds: string[]
}

type ColumnMap = {
  [key: string]: ListWithTaskIds
};
type TaskMap = Record<string, Task>;

interface ProjectContextState {
  project: Project | null | undefined;
  setProject: React.Dispatch<React.SetStateAction<Project | null | undefined>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  columns: ColumnMap;
  setColumns: React.Dispatch<React.SetStateAction<ColumnMap>>;
  columnOrder: string[];
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
}
const ProjectContext = React.createContext<ProjectContextState | undefined>(undefined);
interface ProjectContextProviderProps {
  projectId: string;
  children: React.ReactNode;
}



export const ProjectContextProvider: React.FC<ProjectContextProviderProps> = ({ children, projectId }) => {
  const [project, setProject] = useState<Project | null | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<ColumnMap>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      console.log("brother man!!!!!!!!!!");
      const { data, error } = await supabase.from("project").select().eq("id", projectId).single();
      setProject(data);
      console.log({ data });
      const { data: taskListData } = await supabase.from("task_list").select().eq("project_id", projectId).select();
      const { data: taskData } = await supabase.from("task").select().eq("project_id", projectId).select();

      if (taskListData) {
        const colMap = taskListData.reduce<ColumnMap>((acc, curr) => {
          acc[curr.id] = {
            ...curr,
            taskIds: []
          };
          return acc;
        }, {})

        if (taskData) {
          const taskMap = taskData.reduce<TaskMap>((acc, curr) => {
            if (!acc[curr.id]) {
              acc[curr.id] = curr;
            }
            return acc;
          }, {});

          taskData.forEach((task) => {
            if (task.list_id) {
              colMap[task.list_id].taskIds.push(task.id);
            }
          })
          if (taskMap) {
            Object.values(colMap).forEach((col) => {
              col.taskIds.sort((a, b) => (taskMap[a].position ?? 0) - (taskMap[b].position ?? 0));
            })
          }
          if (taskData) {
            setTasks(taskData);
          }
        }
        const colOrder = Object.keys(colMap).sort((a, b) => (colMap[a].position ?? 0) - (colMap[b].position ?? 0));
        setColumns(colMap);
        setColumnOrder(colOrder);
      }
    }
    loadData();
  }, [])

  const contextValue = {
    project,
    setProject,
    tasks,
    setTasks,
    columns,
    setColumns,
    columnOrder,
    setColumnOrder,
  }

  return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>
};

export const useProjectContext = (): ProjectContextState => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectContextProvider');
  }
  return context;

};
