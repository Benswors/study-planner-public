export const PRIORITIES = [
  {
    value: "low",
    label: "Низький",
    className: "task-item__priority--low",
  },
  {
    value: "medium",
    label: "Середній",
    className: "task-item__priority--medium",
  },
  {
    value: "high",
    label: "Високий",
    className: "task-item__priority--high",
  },
] as const;

export type Priority = (typeof PRIORITIES)[number]["value"];
export const DEFAULT_PRIORITY: Priority = "medium";

export interface ClientOwnedTaskMetadata {
  createdBy: string | null;
  createdAt: string | null;
}

export interface Task extends ClientOwnedTaskMetadata {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
}

export type TaskInput = Omit<
  Task,
  "id" | "completed" | keyof ClientOwnedTaskMetadata
>;

export const TASK_FILTERS = [
  {
    value: "all",
    label: "Всі",
    summaryLabel: "Усього",
    statsClassName: "",
    matches: () => true,
  },
  {
    value: "active",
    label: "Не виконані",
    summaryLabel: "Не виконані",
    statsClassName: "",
    matches: (task: Task) => !task.completed,
  },
  {
    value: "completed",
    label: "Виконані",
    summaryLabel: "Виконані",
    statsClassName: "task-stats__value--completed",
    matches: (task: Task) => task.completed,
  },
] as const;

export type TaskFilter = (typeof TASK_FILTERS)[number]["value"];
export type TaskCounts = Record<TaskFilter, number>;
export const DEFAULT_FILTER: TaskFilter = "all";
