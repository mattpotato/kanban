"use client"
import { Draggable, Droppable } from "@hello-pangea/dnd";
import TaskColumnTitle from "./TaskColumnTitle";
import TaskColumnDropDown from "./TaskColumnDropdown";
import { AddTaskButton } from "./AddTaskButton";
import { createClient } from "@/utils/supabase/client";
import { ListWithTaskIds, useProjectContext } from "../contexts/ProjectContextState";
import { FaPen } from "react-icons/fa6";
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  data: ListWithTaskIds
  index: number
}
const TaskColumn: React.FC<Props> = ({ data, index }) => {
  const supabase = createClient();
  const { tasks, setTasks, columns, setColumns, setColumnOrder } = useProjectContext();
  const handleAddTask = async (title: string) => {
    const { data: userData, error } = await supabase.auth.getUser();
    if (userData.user) {
      let newPosition = 65535;
      if (data.taskIds.length > 0) {
        const lastTaskId = columns[data.id].taskIds[data.taskIds.length - 1];
        console.log({ lastTaskId })
        console.log(tasks);
        const lastTask = tasks.find((task) => task.id === lastTaskId);
        if (lastTask) {
          newPosition = lastTask.position + 65535
        }
      }
      const task = await supabase.from("task").insert({
        list_id: data.id,
        title,
        position: newPosition,
        creator_id: userData.user.id,
        project_id: data.project_id,
      }).select();

      if (task.data) {
        setTasks((prev) => [...prev, task.data[0]]);
        setColumns((prev) => {
          return {
            ...prev,
            [data.id]: {
              ...prev[data.id],
              taskIds: [...prev[data.id].taskIds, task.data[0].id],
            }
          }
        })
      }
      
    }
    if (error) {
      console.error(error);
    }
  }

  const handleDeleteColumn = async () => {
    try {
      await supabase.from("task_list").delete().eq("id", data.id);
      setColumns((prev) => {
        const newColumns = {...prev}
        delete newColumns[data.id]
        return newColumns;
      })
      setColumnOrder((prev) => prev.filter((col) => col !== data.id));
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <Draggable index={index} draggableId={data.id}>
      {(provided) => (
        <div
          className={`bg-white rounded p-4 w-80 flex-grow-0 flex-shrink-0 self-start mx-4 select-none border border-gray-400 shadow-md`}
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          
          >
          <div className="flex justify-between flex-wrap items-center">
            <TaskColumnTitle data={data} />
            <TaskColumnDropDown onDelete={handleDeleteColumn} />
          </div>
          <Droppable droppableId={data.id} type="task">
            {(provided, snapshot) => {
              return <div ref={provided.innerRef} {...provided.droppableProps} className={`min-h[20px] mt-4 ${snapshot.isDraggingOver ? 'bg-blue-200' : ""} duration-300 ease-in-out`}>
                {data.taskIds.map((taskId, index) => {
                  const task = tasks.find((task) => taskId === task.id);
                  if (!task) return null;
                  return <DraggableTaskCard key={`t-${task.id}`} index={index} data={task} />
                })}
                {provided.placeholder}
              </div>
            }}
          </Droppable>
          <AddTaskButton onAddTask={handleAddTask} />
        </div>
      )}
    </Draggable>

  )
}

interface TaskCardProps {
  data: Task
  index: number;
}

type Inputs = {
  title: string
}

const TaskCard: React.FC<TaskCardProps> = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const buttonRef = useRef(null);
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const supabase = createClient();
  const { setTasks } = useProjectContext();

  const toggleIsEditing = () => {
    setIsEditing((prev) => !prev);
  }


  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    if (data.title) {
      const { data : resData, error } = await supabase.from("task").update({ title: formData.title }).eq("id", data.id).select();
      if (resData && resData[0]) {
        if (resData[0]) {
          setTasks((prev) => {
            return prev.map((task) => {
              if (task.id === data.id) {
                return {
                  ...resData[0],
                }
              }
              else {
                return task;
              }
            })
          })
          toggleIsEditing();
          return;
        }
        if (error) {
          console.error("thithti");
        }
        
      }
    }
  };

  const handleBlur = (e: React.FocusEvent ) => {
    if (e.relatedTarget === buttonRef.current) {
      e.preventDefault();
      return;
    }
    toggleIsEditing();
  }

  const handleKeyPress = (e : React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  }

  if (isEditing) {
    return (
      <form className="flex flex-col gap-2 relative" onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register("title", { required: true })}
          className="p-2 rounded flex w-full border border-gray-400 shadow-md resize-none overflow-y-hidden h-auto z-50"
          autoFocus
          onBlur={handleBlur}
          defaultValue={data.title ?? "Untitled Task"}
          onFocus={(e) => e.target.select()}
          rows={3}
          onKeyDown={handleKeyPress}
          />
        <button type="submit" className="p-2 border border-gray-100 self-start bg-blue-600 rounded text-white z-50" ref={buttonRef}>Save</button>
      </form>
    )
  }


  return <div className="p-2 bg-white rounded border border-gray-400 shadow-md flex items-start justify-between group cursor-pointer">
    <div className="w-5/6 break-words">
      {data.title} position: {data.position}
    </div>
    <div className="h-[30px] w-[30px] bg-gray-200 rounded-full flex justify-center items-center group-hover:opacity-100 opacity-0" onClick={toggleIsEditing}>
      <FaPen size={12} className="group-hover:opacity-100 opacity-0 cursor-pointer"/>
    </div>
    
    </div>
}

const DraggableTaskCard: React.FC<TaskCardProps> = ({ data, index }) => {
  return (
    <Draggable draggableId={"t" + data.id} index={index}>
      {(provided) => (
         <div
         ref={provided.innerRef}
         {...provided.draggableProps}
         {...provided.dragHandleProps}
         className="p-1"
       >
          <TaskCard data={data} index={index}/>
        </div>
      )}

    </Draggable>
  )

}


export default TaskColumn;

