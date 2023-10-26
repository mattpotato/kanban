"use client";
import React, { useState } from "react";
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

  const toggleInput = () => {
    setShowInput((prev) => !prev);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    onCreateList(data.listTitle);
    toggleInput();
    reset({});
  };

  return <div className="w-96 bg-slate-400 self-start p-4 rounded flex">
    {showInput ?
      <form className="flex flex-1 flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("listTitle", { required: true })}
          placeholder="Enter list title"
          autoFocus
          autoComplete="off"
          className="rounded flex-1 w-full p-2"
          onBlur={toggleInput} />
        <button type="submit" className="flex-1"><span>+</span>Add new list</button>
      </form>
      :
      <button onClick={toggleInput} className="flex-1 justify-start">
        <span>+</span>
        Add new list
      </button>}
  </div>;

};
