import type { ReactNode } from "react";
import { useTasks } from "../hooks/useTasks";
import { TasksContext } from "./TasksContext";

export default function TasksProvider({ children }: { children: ReactNode }) {
  const tasks = useTasks();
  return <TasksContext value={tasks}>{children}</TasksContext>;
}
