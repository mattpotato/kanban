import { Database } from "./schema.gen";

declare global {
  type Project = Database["public"]["Tables"]["project"]["Row"]
  type TaskList = Database["public"]["Tables"]["task_list"]["Row"]
}