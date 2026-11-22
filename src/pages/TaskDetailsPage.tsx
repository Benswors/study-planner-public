import "./TaskDetailsPage.scss";
import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { taskRepository } from "../repositories/taskRepository";
import { useRequest } from "../hooks/useRequest";
import { useTaskStore } from "../hooks/useTaskStore";
import { useAuth } from "../hooks/useAuth";
import TaskFormDialog from "../components/TaskFormDialog";
import { PRIORITIES } from "../types/task";

export default function TaskDetailsPage() {
  const { taskId = "" } = useParams();
  return <TaskDetails key={taskId} taskId={taskId} />;
}

function TaskDetails({ taskId }: { taskId: string }) {
  const { sessionTasks, changes, saving, updateTask, deleteTask } =
    useTaskStore();
  const { isAuthenticated } = useAuth();
  const [panel, setPanel] = useState<"edit" | "delete" | null>(null);
  const navigate = useNavigate();
  const load = useCallback(
    (signal: AbortSignal) => taskRepository.getById(taskId, signal),
    [taskId],
  );
  const { state, retry } = useRequest(load);
  const sessionTask = sessionTasks.find((task) => task.id === taskId);
  const task = sessionTask ?? (state.status === "success" ? state.data : null);
  const local = taskId.startsWith("local-");

  function open(action: "edit" | "delete") {
    if (!isAuthenticated) {
      navigate(`/login?next=${encodeURIComponent("/tasks/" + taskId)}`);
      return;
    }
    setPanel(action);
  }

  if (!local && state.status === "loading")
    return <p role="status">Завантаження деталей…</p>;
  if (!local && state.status === "error") {
    return (
      <div>
        <p role="alert">{state.message}</p>
        <button
          className="button button--secondary"
          type="button"
          onClick={retry}
        >
          Спробувати ще
        </button>
      </div>
    );
  }
  if (!task || changes[taskId] === null) {
    return (
      <p>
        Завдання не знайдено. <Link to="/tasks">До списку</Link>
      </p>
    );
  }

  const priority = PRIORITIES.find((item) => item.value === task.priority);
  return (
    <article className="task-details-page">
      <Link to="/tasks">До списку</Link>
      <h1>{task.title}</h1>
      <dl>
        <dt>Опис</dt>
        <dd>{task.description || "Без опису"}</dd>
        <dt>Категорія</dt>
        <dd>{task.category}</dd>
        <dt>Пріоритет</dt>
        <dd>{priority?.label}</dd>
        <dt>Стан</dt>
        <dd>{task.completed ? "Виконано" : "Не виконано"}</dd>
        <dt>Створив</dt>
        <dd>{task.createdBy ?? "Не вказано"}</dd>
        <dt>Дата створення</dt>
        <dd>
          {task.createdAt
            ? new Date(task.createdAt).toLocaleString("uk-UA")
            : "Не вказано"}
        </dd>
      </dl>
      <div className="task-details-page__actions">
        <button
          className="button button--secondary"
          type="button"
          disabled={saving}
          onClick={() => open("edit")}
        >
          Редагувати
        </button>
        <button
          className="button button--danger"
          type="button"
          disabled={saving}
          onClick={() => open("delete")}
        >
          Видалити
        </button>
      </div>
      {panel === "edit" && isAuthenticated && (
        <TaskFormDialog
          mode="edit"
          task={task}
          onClose={() => setPanel(null)}
          onSubmit={(data) => updateTask(task, data)}
        />
      )}
      {panel === "delete" && isAuthenticated && (
        <div className="task-details-page__confirm">
          <p>Видалити це завдання?</p>
          <button
            className="button button--danger"
            type="button"
            disabled={saving}
            onClick={async () => {
              if (await deleteTask(task)) navigate("/tasks");
            }}
          >
            Підтвердити
          </button>
          <button
            className="button button--secondary"
            type="button"
            disabled={saving}
            onClick={() => setPanel(null)}
          >
            Скасувати
          </button>
        </div>
      )}
    </article>
  );
}
