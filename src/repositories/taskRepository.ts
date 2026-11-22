import { getSession } from "../api/session";
import { request } from "../api/httpClient";
import { DEFAULT_PRIORITY } from "../types/task";
import type { Task, TaskInput } from "../types/task";

interface ApiTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface TodosResponse {
  todos: ApiTodo[];
  total: number;
}

type TaskChanges = Partial<TaskInput & Pick<Task, "completed">>;

function toTask(todo: ApiTodo): Task {
  return {
    id: String(todo.id),
    createdBy: null,
    createdAt: null,
    title: todo.todo,
    completed: todo.completed,
    description: "",
    priority: DEFAULT_PRIORITY,
    category: "Загальне",
  };
}

function jsonBody(body: object) {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const taskRepository = {
  async getAll(page: number, limit: number, signal: AbortSignal) {
    const query = new URLSearchParams({
      limit: String(limit),
      skip: String(page * limit),
    });
    const result = await request<TodosResponse>(`/todos?${query}`, { signal });
    return { tasks: result.todos.map(toTask), total: result.total };
  },

  async getById(id: string, signal: AbortSignal): Promise<Task | null> {
    if (id.startsWith("local-")) return null;

    const todo = await request<ApiTodo>(`/todos/${id}`, { signal });
    return toTask(todo);
  },

  async create(values: TaskInput): Promise<Task> {
    const session = getSession();
    if (!session) throw new Error("Увійдіть, щоб створити завдання.");

    const todo = await request<ApiTodo>(
      "/todos/add",
      {
        method: "POST",
        ...jsonBody({
          todo: values.title,
          completed: false,
          userId: session.user.id,
        }),
      },
      true,
    );

    return {
      ...values,
      createdBy: session.user.username,
      createdAt: new Date().toISOString(),
      id: `local-${crypto.randomUUID()}`,
      title: todo.todo,
      completed: todo.completed,
    };
  },

  async update(task: Task, changes: TaskChanges): Promise<Task> {
    if (!getSession()) throw new Error("Увійдіть, щоб змінити завдання.");
    if (task.id.startsWith("local-")) return { ...task, ...changes };

    const todo = await request<ApiTodo>(
      `/todos/${task.id}`,
      {
        method: "PATCH",
        ...jsonBody({
          todo: changes.title ?? task.title,
          completed: changes.completed ?? task.completed,
        }),
      },
      true,
    );
    return { ...task, ...changes, title: todo.todo, completed: todo.completed };
  },

  async delete(task: Task): Promise<void> {
    if (!getSession()) throw new Error("Увійдіть, щоб змінити завдання.");
    if (task.id.startsWith("local-")) return;

    await request<ApiTodo>(`/todos/${task.id}`, { method: "DELETE" }, true);
  },
};
