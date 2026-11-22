import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { taskRepository } from "../repositories/taskRepository";
import type { Task, TaskInput } from "../types/task";
import { useRequest } from "./useRequest";

const PAGE_SIZE = 10;

type Message = { kind: "success" | "error"; text: string };

export function useTasks() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(0);
  const [created, setCreated] = useState<Task[]>([]);
  const [changes, setChanges] = useState<Record<string, Task | null>>({});
  const [message, setMessage] = useState<Message | null>(null);
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const load = useCallback(
    (signal: AbortSignal) => taskRepository.getAll(page, PAGE_SIZE, signal),
    [page],
  );
  const { state, retry } = useRequest(load);

  useEffect(() => {
    if (message?.kind !== "success") return;

    const timer = window.setTimeout(() => setMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const tasks =
    state.status === "success"
      ? [
          ...(page === 0 ? created : []),
          ...state.data.tasks.flatMap((task) => {
            const change = changes[task.id];
            return change === null ? [] : [change ?? task];
          }),
        ]
      : page === 0
        ? created
        : [];
  const pageCount =
    state.status === "success"
      ? Math.max(1, Math.ceil(state.data.total / PAGE_SIZE))
      : null;

  async function save(
    action: () => Promise<void>,
    success: string,
    failure: string,
  ) {
    if (!isAuthenticated) {
      setMessage({ kind: "error", text: "Увійдіть, щоб виконати цю дію." });
      return false;
    }
    if (busy.current) return false;

    busy.current = true;
    setSaving(true);
    setMessage(null);

    try {
      await action();
      setMessage({ kind: "success", text: success });
      return true;
    } catch {
      setMessage({ kind: "error", text: failure });
      return false;
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  function addTask(values: TaskInput) {
    return save(
      async () => {
        const task = await taskRepository.create(values);
        setCreated((previous) => [task, ...previous]);
        setPage(0);
      },
      "Завдання додано.",
      "Не вдалося додати завдання. Спробуйте ще раз.",
    );
  }

  function updateTask(
    task: Task,
    values: Partial<TaskInput> & { completed?: boolean },
  ) {
    return save(
      async () => {
        const updated = await taskRepository.update(task, values);
        if (task.id.startsWith("local-")) {
          setCreated((previous) =>
            previous.map((item) => (item.id === task.id ? updated : item)),
          );
        } else {
          setChanges((previous) => ({ ...previous, [task.id]: updated }));
        }
      },
      "Зміни збережено.",
      "Не вдалося зберегти зміни. Спробуйте ще раз.",
    );
  }

  function deleteTask(task: Task) {
    return save(
      async () => {
        await taskRepository.delete(task);
        if (task.id.startsWith("local-")) {
          setCreated((previous) =>
            previous.filter((item) => item.id !== task.id),
          );
        } else {
          setChanges((previous) => ({ ...previous, [task.id]: null }));
        }
      },
      "Завдання видалено.",
      "Не вдалося видалити завдання. Спробуйте ще раз.",
    );
  }

  const sessionTasks = [
    ...created,
    ...Object.values(changes).filter((task): task is Task => task !== null),
  ];

  return {
    sessionTasks,
    state,
    retry,
    page,
    setPage,
    pageCount,
    tasks,
    changes,
    saving,
    message,
    addTask,
    updateTask,
    deleteTask,
  };
}
