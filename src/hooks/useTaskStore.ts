import { useContext } from "react";
import { TasksContext } from "../context/TasksContext";

export function useTaskStore() {
  const value = useContext(TasksContext);
  if (!value) throw new Error("useTaskStore requires TasksProvider.");
  return value;
}
