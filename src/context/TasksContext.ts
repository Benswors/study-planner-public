import { createContext } from "react";
import type { useTasks } from "../hooks/useTasks";

export const TasksContext = createContext<ReturnType<typeof useTasks> | null>(
  null,
);
