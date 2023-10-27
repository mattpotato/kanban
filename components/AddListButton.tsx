"use client";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";

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

  const handleBlur = (e: React.FocusEvent) => {
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

  return <div className="w-80 bg-white self-start p-4 rounded flex select-none shadow-md border border-gray-400">
    {showInput ?
      <form className="flex flex-1 flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("listTitle", { required: true })}
          placeholder="Enter list title"
          autoFocus
          autoComplete="off"
          className="rounded flex-1 w-full p-2"
          onBlur={handleBlur} />
        <button type="submit" className="flex-1 flex justify-start items-center gap-2" ref={buttonRef}>
          <FaPlus className="inline" />
          <span className="text-sm">Add list</span>

        </button>
      </form>
      :
      <button onClick={toggleInput} className="flex-1 justify-start flex items-center gap-2">
        <FaPlus className="inline" />
        Add new list
      </button>}
  </div>;

};
