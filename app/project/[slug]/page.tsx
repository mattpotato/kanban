"use client"
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react"

export default function Page({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<Project>();
  const supabase = createClient();

  useEffect(() => {
    const loadProject = async () => {
      const res = await supabase.from("project").select().eq("id", params.slug).single();

      if (res.data) {
        setProject(res.data);
      }

    }
    if (params.slug) {
      loadProject();
    }
  }, [])
  return <div>{params.slug} {project?.title}</div>

}