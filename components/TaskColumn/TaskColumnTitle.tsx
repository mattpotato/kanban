import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  data: TaskList
}

type Inputs = {
  title: string;
}

const TaskColumnTitle: React.FC<Props> = ({ data }) => {
  const [showInput, setShowInput] = useState(false);
  const { register, handleSubmit } = useForm<Inputs>();
  const { title, id } = data;
  const [columnTitle, setColumnTitle] = useState(title ?? "Untitled List");
  const supabase = createClient();

  const toggleInput = () => {
    setShowInput((prev) => !prev);
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setColumnTitle(data.title);
    try {
      const res = await supabase.from("task_list").update({ title: data.title }).eq("id", id).select();
      console.log({ res })
    } catch (err) {
      console.error(err);
    }
    toggleInput();
  }

  return <div className="flex flex-1">
    {showInput ?
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <input {...register("title", { required: true })}
          placeholder="Enter column title"
          autoFocus
          autoComplete="off"
          className="rounded w-full"
          onBlur={toggleInput}
          defaultValue={columnTitle}
          onFocus={(e) => e.target.select()}
        />
      </form>
      :
      <button onClick={toggleInput}>
        {columnTitle}
      </button>
    }
  </div>
}

export default TaskColumnTitle