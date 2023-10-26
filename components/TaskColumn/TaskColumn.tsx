"use client"
import { Draggable, Droppable } from "@hello-pangea/dnd";
import TaskColumnTitle from "./TaskColumnTitle";
import TaskColumnDropDown from "./TaskColumnDropdown";
import { AddTaskButton } from "./AddTaskButton";
import { createClient } from "@/utils/supabase/client";
import { ListWithTaskIds, useProjectContext } from "../contexts/ProjectContextState";

interface Props {
  data: ListWithTaskIds
  index: number
}
const TaskColumn: React.FC<Props> = ({ data, index }) => {
  const supabase = createClient();
  const { tasks, setTasks, setColumns, setColumnOrder } = useProjectContext();
  const handleAddTask = async (title: string) => {
    const { data: userData, error } = await supabase.auth.getUser();
    if (userData.user) {
      const task = await supabase.from("task").insert({
        list_id: data.id,
        title,
        position: 65535,
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
      setColumnOrder((prev) => prev.filter((col) => col === data.id));
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <Draggable index={index} draggableId={data.id}>
      {(provided) => (
        <div
          className="bg-slate-400 rounded p-4 w-80 flex-grow-0 flex-shrink-0 self-start mx-4"
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}>
          <div className="flex justify-between flex-wrap">
            <TaskColumnTitle data={data} />
            <TaskColumnDropDown onDelete={handleDeleteColumn} />
          </div>
          <div>position {data.position}</div>
          <Droppable droppableId={data.id} type="task">
            {(provided) => {
              return <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[50px]">
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

const TaskCard: React.FC<TaskCardProps> = ({ data }) => {
  return <div className="p-2 bg-white rounded">{data.title} position: {data.position}</div>
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

