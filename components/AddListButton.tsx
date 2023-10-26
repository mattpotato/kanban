"use client";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export type Inputs = {
  listTitle: string
}

export interface AddListButtonProps {
  onCreateList: (title: string) => void;
}

export const AddListButton: React.FC<AddListButtonProps> = ({ onCreateList }) => {
  const [showInput, setShowInput] = useState(false);
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const buttonRef = useRef(null);

  const toggleInput = () => {
    setShowInput((prev) => !prev);
    reset({});
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
    onCreateList(data.listTitle);
    toggleInput();
    reset({});
  };

  return <div className="w-80 bg-slate-400 self-start p-4 rounded flex">
    {showInput ?
      <form className="flex flex-1 flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("listTitle", { required: true })}
          placeholder="Enter list title"
          autoFocus
          autoComplete="off"
          className="rounded flex-1 w-full p-2"
          onBlur={handleBlur}/>
        <button type="submit" className="flex-1 flex justify-start" ref={buttonRef}><span>+</span>Add new list</button>
      </form>
      :
      <button onClick={toggleInput} className="flex-1 justify-start">
        <span>+</span>
        Add new list
      </button>}
  </div>;

};
