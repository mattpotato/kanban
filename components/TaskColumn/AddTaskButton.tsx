"use client";
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export type Inputs = {
  taskTitle: string
}

interface Props {
  onAddTask: (title: string) => void;
}

export const AddTaskButton: React.FC<Props> = ({ onAddTask }) => {
  const [showInput, setShowInput] = useState(false);
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const buttonRef = useRef(null);

  const toggleInput = () => {
    setShowInput((prev) => !prev);
    reset({})
  };

  const handleBlur = (e: React.FocusEvent ) => {
    console.log(e.relatedTarget?.id);
    if (e.relatedTarget === buttonRef.current) {
      e.preventDefault();
      return;
    }
    toggleInput();

  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    onAddTask(data.taskTitle)
    toggleInput();
    reset({});
  };

  return <div className="self-start flex gap-2">
    {showInput ?
      <form className="flex flex-1 flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("taskTitle", { required: true })}
          placeholder="Enter task title..."
          autoFocus
          autoComplete="off"
          className="rounded flex-1 p-2 m-1"
          onBlur={handleBlur} />
        <button type="submit" className="flex-1 p-2 flex items-start" ref={buttonRef}><span>+</span>Add task</button>
      </form>
      :
      <button onClick={toggleInput} className="flex flex-1 justify-start items-start">
        <span>+</span>
        Add new task
      </button>}
  </div>;

};
