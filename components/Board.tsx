"use client"
import ProjectTitle from "@/components/ProjectTitle";
import { createClient } from "@/utils/supabase/client";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { AddListButton } from "@/components/AddListButton";
import TaskColumn from "@/components/TaskColumn/TaskColumn";
import { useProjectContext } from "@/components/contexts/ProjectContextState";
import React from "react";

interface Props {
  projectId: string
}

const Board: React.FC<Props> = ({ projectId }) => {
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
      const res = await supabase.from("task_list").insert({ title, creator_id: user.data.user.id, project_id: projectId, position: newPosition }).select();
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
      if (source.index === destination.index) return;
      const sourceList = columns[columnOrder[source.index]];
      const newList = columnOrder.filter((_, idx) => idx !== source.index);
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
        // if source.index < destination - we will move things to the left, and so offset should be + 1
        // if source.index > destination.index - we will move things to the right, so offset should be - 1
        const offset = source.index < destination.index ? 1 : - 1
        const secondItem = columns[columnOrder[destination.index + offset]];
        newPosition = (firstItem.position + secondItem.position) / 2;
      }
      newList.splice(destination.index, 0, columnOrder[source.index]);
      setColumnOrder(newList);
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
      return;
    }
    if (source.droppableId === destination.droppableId) {
      if (source.index === destination.index) return;
      const sourceList = columns[source.droppableId];
      const sourceListItems = [...sourceList.taskIds];
      const originalTaskId = sourceListItems[source.index];
      let newPosition = 65535;
      if (destination.index === sourceListItems.length - 1) {
        const taskId = sourceListItems[destination.index];
        const lastTask = tasks.find((task) => task.id === taskId);
        if (lastTask) {
          newPosition = lastTask.position + 65535;
        }
      }
      else if (destination.index === 0) {
        const taskId = sourceListItems[destination.index];
        const firstTask = tasks.find((task) => task.id === taskId);

        if (firstTask) {
          newPosition = firstTask.position / 2;
        }

      }
      else {
        const firstTaskId = sourceListItems[destination.index];
        const offset = source.index < destination.index ? 1 : -1;
        const secondTaskId = sourceListItems[destination.index + offset];
        const firstTask = tasks.find((task) => task.id === firstTaskId);
        const secondTask = tasks.find((task) => task.id === secondTaskId);
        if (firstTask && secondTask) {
          newPosition = (firstTask.position + secondTask.position) / 2;
        }
      }

      const newList = sourceListItems.filter((_, idx) => idx !== source.index);
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
      try {
        const res = await supabase
          .from("task")
          .update({ position: newPosition })
          .eq("id", originalTaskId)
          .select();

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
      const destinationItems = [...destinationList.taskIds];

      let newPosition = 65535;
      if (destination.index === destinationList.taskIds.length) {
        const taskId = destinationItems[destination.index - 1];
        const lastTask = tasks.find((task) => task.id === taskId);
        if (lastTask) {
          newPosition = lastTask.position + 65535;
        }
      }
      else if (destination.index === 0) {
        const firstTaskId = destinationItems[destination.index];
        const firstTask = tasks.find((task) => task.id === firstTaskId);
        if (firstTask) {
          newPosition = firstTask.position / 2;
        }
      }
      else {
        const firstTaskId = destinationItems[destination.index];
        const secondTaskId = destinationItems[destination.index - 1];
        const firstTask = tasks.find((task) => task.id === firstTaskId);
        const secondTask = tasks.find((task) => task.id === secondTaskId);
        if (firstTask && secondTask) {
          newPosition = (firstTask.position + secondTask.position) / 2;
        }
      }
      const newStartCol = {
        ...sourceList,
        taskIds: sourceListItems,
      }
      const [removed] = sourceListItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, removed);
      const newEndCol = {
        ...destinationList,
        taskIds: destinationItems,
      }

      const newState = {
        ...columns,
        [source.droppableId]: newStartCol,
        [destination.droppableId]: newEndCol,
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

  return <div className="flex flex-col flex-1 w-full">
    <div className="mb-4">
      {project && <ProjectTitle project={project as unknown as Project} />}
    </div>
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" type="column" direction="horizontal">
        {(provided) => (
          <div className="flex overflow-x-auto flex-1" ref={provided.innerRef} {...provided.droppableProps}>
            {columnOrder.map((id, index) => {
              const col = columns[id]
              if (!col) return null;
              return <TaskColumn data={col} key={`col-${col.id}`} index={index} />
            })}
            {provided.placeholder}
            <div className="px-4">
              <AddListButton onCreateList={handleCreateList} />
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>

  </div>

}

export default Board;
