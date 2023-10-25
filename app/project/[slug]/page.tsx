"use client"
import ProjectTitle from "@/components/ProjectTitle";
import TaskColumnTitle from "@/components/TaskColumnTitle";
import { createClient } from "@/utils/supabase/client";
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form";

export default function Page({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<Project>();
  const supabase = createClient();
  const [columns, setColumns] = useState<{ [key: string]: TaskList }>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  useEffect(() => {
    const loadProject = async () => {
      const projectData = await supabase.from("project").select().eq("id", params.slug).single();
      const taskListData = await supabase.from("task_list").select().eq("project_id", params.slug).select();
      if (projectData.data) {
        setProject(projectData.data);
      }
      if (taskListData.data) {
        const colMap = taskListData.data.reduce<{ [key: string]: TaskList }>((acc, curr) => {
          acc[curr.id] = curr;
          return acc;
        }, {})
        const colOrder = Object.keys(colMap).sort((a, b) => (colMap[a].position ?? 0) - (colMap[b].position ?? 0));
        setColumns(colMap);
        setColumnOrder(colOrder);
      }
    }
    if (params.slug) {
      loadProject();
    }
  }, [])

  const handleCreateList = async (title: string) => {
    const user = await supabase.auth.getUser();
    let newPosition = 65535;
    if (columnOrder.length > 0) {
      const lastColumnId = columnOrder[columnOrder.length - 1];
      const lastColumn = columns[lastColumnId];
      newPosition = (lastColumn.position ?? 0) + 65535
    }

    if (user.data.user) {
      const res = await supabase.from("task_list").insert({ title, creator_id: user.data.user.id, project_id: params.slug, position: newPosition }).select();
      if (res.data) {
        setColumns((prev) => {
          return {
            ...prev,
            [res.data[0].id]: res.data[0]
          }
        })
        setColumnOrder((prev) => [...prev, res.data[0].id]);
      }
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    console.log({ result })
    if (type === "column") {
      const sourceList = columns[columnOrder[source.index]];
      const newList = columnOrder.filter((_, idx) => idx !== source.index);
      newList.splice(destination.index, 0, columnOrder[source.index]);
      let newPosition = 0;
      if (destination.index === Object.keys(columns).length - 1) {
        const lastItem = columns[columnOrder[destination.index]];
        newPosition = lastItem.position + 65535;
      }
      else if (destination.index === 0) {
        const firstItem = columns[columnOrder[destination.index]];
        newPosition = firstItem.position / 2;
      }
      else {
        const firstItem = columns[columnOrder[destination.index]];
        const secondItem = columns[columnOrder[destination.index + 1]];
        newPosition = (firstItem.position + secondItem.position) / 2;
      }
      setColumns((prev) => {
        return {
          ...prev,
          [sourceList.id]: {
            ...prev[sourceList.id],
            position: newPosition
          }
        }
      })
      setColumnOrder(newList);
      try {
        await supabase.from("task_list").update({ "position": newPosition }).eq("id", sourceList.id);
      } catch (err) {
        console.log(err);
      }
      return;
    }
  }

  return <div className="flex flex-col flex-1 bg-green-200 w-full">
    {project && <ProjectTitle project={project} />}
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" type="column" direction="horizontal">
        {(provided) => (
          <div className="flex overflow-x-scroll flex-1" ref={provided.innerRef} {...provided.droppableProps}>
            {columnOrder.map((id, index) => {
              const col = columns[id]
              if (!col) return null;
              return <Draggable index={index} draggableId={col.id} key={"col-" + col.id}>
                {(provided) => (
                  <div
                    className="bg-slate-400 rounded p-4 w-96 flex-grow-0 flex-shrink-0 self-start mx-4"
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}>
                    <TaskColumnTitle data={col} />
                  </div>
                )}
              </Draggable>
            })}
            {provided.placeholder}
            <AddListButton onCreateList={handleCreateList} />
          </div>
        )}
      </Droppable>
    </DragDropContext>

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