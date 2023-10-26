"use client"
import ProjectTitle from "@/components/ProjectTitle";
import { createClient } from "@/utils/supabase/client";
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react"
import { AddListButton } from "@/components/AddListButton";
import TaskColumn from "@/components/TaskColumn/TaskColumn";
import { useProjectContext }  from "@/components/contexts/ProjectContextState";

interface ListWithTaskIds extends TaskList {
  taskIds: string[]
}


export default function Page({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const {
    columns,
    setColumns,
    columnOrder,
    setColumnOrder,
    project,
    tasks,
    setTasks,
  } = useProjectContext();

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
            [res.data[0].id]: {
              ...res.data[0],
              taskIds: [],
            }
          }
        })
        setColumnOrder((prev) => [...prev, res.data[0].id]);
      }
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "column") {
      const sourceList = columns[columnOrder[source.index]];
      const newList = columnOrder.filter((_, idx) => idx !== source.index);
      newList.splice(destination.index, 0, columnOrder[source.index]);
      setColumnOrder(newList);
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
        const offset = source.index === Object.keys(columns).length - 1 ? -1 : + 1;
        const secondItem = columns[columnOrder[destination.index + offset]];
        console.log({ firstItem, secondItem });
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
      try {
        await supabase.from("task_list").update({ "position": newPosition }).eq("id", sourceList.id);
      } catch (err) {
        console.log(err);
      }
    }
    if (source.droppableId === destination.droppableId) {
      const sourceList = columns[source.droppableId];
      const sourceListItems = [...sourceList.taskIds];
      const originalTaskId = sourceListItems[source.index];
      let newPosition = 65535;
      if (destination.index === sourceListItems.length - 1) {
        console.log("AT THE END");
        const taskId = sourceListItems[destination.index] ;
        const lastTask = tasks.find((task) => task.id === taskId);
        if (lastTask) {
          newPosition = lastTask.position + 65535;
        }
      }
      else if (destination.index === 0) {
        const taskId = sourceListItems[destination.index] ;
        const firstTask = tasks.find((task) => task.id === taskId);

        if (firstTask) {
          newPosition = firstTask.position / 2;
        }

      }
      else {
        const firstTaskId = sourceListItems[destination.index];
        const secondTaskId = sourceListItems[destination.index + 1];
        const firstTask = tasks.find((task) => task.id === firstTaskId);
        const secondTask = tasks.find((task) => task.id === secondTaskId);
        if (firstTask && secondTask) {
          newPosition = (firstTask.position + secondTask.position) / 2;
        }
      }

      const newList = sourceListItems.filter((_ , idx) => idx !== source.index);
      newList.splice(destination.index, 0, sourceList.taskIds[source.index]);

      const newData = {
        ...columns,
        [source.droppableId]: {
          ...sourceList,
          taskIds: newList
        }
      }
      setColumns(newData);
      setTasks((prev) => {
        return prev.map((task) => ({
          ...task,
          position: task.id === originalTaskId ? newPosition : task.position
        }));
      })
      console.log({ newPosition, originalTaskId })
      try {
        console.log("WADDUP", originalTaskId);
        const res = await supabase
          .from("task")
          .update({ position: newPosition })
          .eq("id", originalTaskId)
          .select();
        console.log({ res })

      } catch (err) {
        console.log(err);
      }
      return;
    }

    else {
      const sourceList = columns[source.droppableId];
      const destinationList = columns[destination.droppableId];
      const sourceListItems = [...sourceList.taskIds];
      const originalTaskId = sourceListItems[source.index];
      const [removed] = sourceListItems.splice(source.index, 1);

      const newStartCol  = {
        ...sourceList,
        taskIds: sourceListItems,
      }

      const destinationItems = [...destinationList.taskIds];
      destinationItems.splice(destination.index, 0, removed);

      const newEndCol = {
        ...destinationList,
        taskIds: destinationItems,
      }

      const newState = {
        ...columns,
        [source.droppableId] : newStartCol,
        [destination.droppableId] : newEndCol,
      }

      let newPosition = 65535;
      if (destination.index === destinationList.taskIds.length) {
        const taskId = destinationItems[destination.index - 1];
        const lastTask = tasks.find((task) => task.id === taskId);
        if (lastTask) {
          newPosition = lastTask.position + 65535;
        }
      }
      else if (destination.index === 0) {
        const firstTaskId = destinationItems[destination.index + 1];
        const firstTask = tasks.find((task) => task.id === firstTaskId);
        if (firstTask) {
          newPosition = firstTask.position / 2;
        }
      }
      else {
        const firstTaskId = destinationItems[destination.index];
        const secondTaskId = destinationItems[destination.index + 1];
        const firstTask = tasks.find((task) => task.id === firstTaskId);
        const secondTask = tasks.find((task) => task.id === secondTaskId);

        if (firstTask && secondTask) {
          newPosition = (firstTask.position + secondTask.position) / 2;
        }
      }
      setTasks((prev) => {
        return prev.map((task) => ({
          ...task,
          position: task.id === originalTaskId ? newPosition : task.position
        }));
      })
      setColumns(newState);
      try {
        const res2 = await supabase.from("task").select().eq("id", removed);
        console.log({ res2 })
        const res = await supabase
          .from("task")
          .update({ position: newPosition, list_id: destination.droppableId })
          .eq("id", removed)
          .select();
        console.log({ res })
      } catch (err) {
        console.log(err);
      }
    }
  }

  return <div className="flex flex-col flex-1 bg-green-200 w-full">
    {project && <ProjectTitle project={project as unknown as Project} />}
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" type="column" direction="horizontal">
        {(provided) => (
          <div className="flex overflow-x-scroll flex-1" ref={provided.innerRef} {...provided.droppableProps}>
            {columnOrder.map((id, index) => {
              const col = columns[id]
              if (!col) return null;
              return <TaskColumn data={col} key={`col-${col.id}`} index={index} />
            })}
            {provided.placeholder}
            <AddListButton onCreateList={handleCreateList} />
          </div>
        )}
      </Droppable>
    </DragDropContext>

  </div>

}
