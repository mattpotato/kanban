"use client"
import ProjectTitle from "@/components/ProjectTitle";
import TaskColumnTitle from "@/components/TaskColumnTitle";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form";

export default function Page({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<Project>();
  const supabase = createClient();
  const [columns, setColumns] = useState<TaskList[]>([]);

  useEffect(() => {
    const loadProject = async () => {
      const projectData = await supabase.from("project").select().eq("id", params.slug).single();
      const taskListData = await supabase.from("task_list").select().eq("project_id", params.slug).select();
      if (projectData.data) {
        setProject(projectData.data);
      }
      if (taskListData.data) {
        setColumns(taskListData.data)
      }
    }
    if (params.slug) {
      loadProject();
    }
  }, [])

  const handleCreateList = async (title: string) => {
    const user = await supabase.auth.getUser();
    let newPosition = 65535;
    if (columns.length > 0) {
      newPosition = (columns[columns.length - 1].position ?? 0) + 65535
    }
    if (user.data.user) {
      const res = await supabase.from("task_list").insert({ title, creator_id: user.data.user.id, project_id: params.slug, position: newPosition }).select();
      if (res.data) {
        setColumns((prev) => [...prev, res.data[0]])
      }
    }
  }

  return <div className="flex flex-col flex-1 bg-green-200 w-full">
    {project && <ProjectTitle project={project} />}
    <div className="flex gap-4 overflow-x-scroll flex-1">
      {columns.map((col) => {
        return <div key={col.id} className="bg-slate-400 rounded p-4 w-96 flex-grow-0 flex-shrink-0 self-start">
          <TaskColumnTitle data={col} />
          </div>
      })}
      <AddListButton onCreateList={handleCreateList}/>
    </div>
  </div>

}

type Inputs = {
  listTitle: string
}

interface AddListButtonProps {
  onCreateList: (title: string) => void;
}
const AddListButton: React.FC<AddListButtonProps> = ({ onCreateList }) => {
  const [showInput, setShowInput] = useState(false);
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const toggleInput = () => {
    setShowInput((prev) => !prev);
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    onCreateList(data.listTitle);
    toggleInput();
    reset({})
  }

  return <div className="w-96 bg-slate-400 self-start p-4 rounded flex">
    {showInput ?
      <form className="flex flex-1 flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("listTitle", { required: true })}
          placeholder="Enter list title"
          autoFocus
          autoComplete="off"
          className="rounded flex-1 w-full p-2"
          onBlur={toggleInput}
        />
        <button type="submit" className="flex-1"><span>+</span>Add new list</button>
      </form>
      :
      <button onClick={toggleInput} className="flex-1 justify-start">
        <span>+</span>
        Add new list
      </button>
    }
  </div>

}