import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  project: Project
}

type Inputs = {
  title: string;
}

const ProjectTitle: React.FC<Props> = ({ project }) => {
  const [showInput, setShowInput] = useState(false);
  const { register, handleSubmit } = useForm<Inputs>();
  const { title } = project;
  const [projectTitle, setTitle] = useState(title ?? "Untitled Project");
  const supabase = createClient();

  const toggleInput = () => {
    setShowInput((prev) => !prev);
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setTitle(data.title);
    try {
      const res = await supabase.from("project").update({ title: data.title }).eq("id", project.id).select();
      console.log({ res })
    } catch (err) {
      console.error(err);
    }
    toggleInput();
  }

  return <div>
    {showInput ?
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("title", { required: true })}
          placeholder="Enter project title"
          autoFocus
          autoComplete="off"
          className="rounded p-2"
          onBlur={toggleInput}
          defaultValue={projectTitle}
          onFocus={(e) => e.target.select()}
        />
      </form>
      :
      <button onClick={toggleInput} className="flex-1 justify-start p-2">
        {projectTitle}
      </button>
    }
  </div>
}

export default ProjectTitle