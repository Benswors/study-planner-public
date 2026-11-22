import "./TasksPage.scss";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import TaskFilters from "../components/TaskFilters";
import TaskStats from "../components/TaskStats";
import TaskFormDialog from "../components/TaskFormDialog";
import { useTaskStore } from "../hooks/useTaskStore";
import { useAuth } from "../hooks/useAuth";
import { DEFAULT_FILTER, PRIORITIES, TASK_FILTERS } from "../types/task";
import type { TaskCounts, TaskFilter, TaskInput } from "../types/task";

export default function TasksPage() {
  const {
    state,
    retry,
    tasks,
    page,
    pageCount,
    setPage,
    saving,
    addTask,
    updateTask,
  } = useTaskStore();
  const { isAuthenticated } = useAuth();
  const [params, setParams] = useSearchParams();
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const filter =
    TASK_FILTERS.find((item) => item.value === params.get("status")) ??
    TASK_FILTERS[0];
  const priority = PRIORITIES.find(
    (item) => item.value === params.get("priority"),
  );
  const visibleTasks = tasks.filter(
    (task) =>
      filter.matches(task) && (!priority || task.priority === priority.value),
  );
  const counts = Object.fromEntries(
    TASK_FILTERS.map((item) => [item.value, tasks.filter(item.matches).length]),
  ) as TaskCounts;

  useEffect(() => {
    document.title = `Study Planner — ${counts.active} active on this page`;
  }, [counts.active]);

  function changeFilter(value: TaskFilter) {
    const next = new URLSearchParams(params);
    if (value === DEFAULT_FILTER) next.delete("status");
    else next.set("status", value);
    setParams(next);
  }

  function create() {
    if (!isAuthenticated) {
      navigate(`/login?next=${encodeURIComponent("/tasks?" + params)}`);
      return;
    }
    setCreating(true);
  }

  async function submit(values: TaskInput) {
    const saved = await addTask(values);
    if (saved) setParams({});
    return saved;
  }

  return (
    <section className="tasks-page">
      <div className="tasks-page__heading">
        <h1>Завдання</h1>
        <button
          className="button button--primary"
          type="button"
          onClick={create}
          aria-label="Створити завдання"
        >
          +
        </button>
      </div>
      <p className="tasks-page__note">
        Зміни діють до перезавантаження сторінки.
      </p>
      <p>Статистика на цій сторінці</p>
      <TaskStats counts={counts} />
      <div className="task-board">
        <div className="task-board__toolbar">
          <TaskFilters
            value={filter.value}
            onChange={changeFilter}
            counts={counts}
          />
          <label className="tasks-page__priority">
            Пріоритет
            <select
              value={priority?.value ?? ""}
              onChange={(event) => {
                const next = new URLSearchParams(params);
                if (event.target.value)
                  next.set("priority", event.target.value);
                else next.delete("priority");
                setParams(next);
              }}
            >
              <option value="">Усі</option>
              {PRIORITIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {state.status === "loading" && (
          <p className="task-board__status" role="status">
            Завантаження завдань…
          </p>
        )}
        {state.status === "error" && (
          <div className="task-board__status">
            <p role="alert">Не вдалося завантажити завдання. {state.message}</p>
            <button
              className="button button--secondary"
              type="button"
              onClick={retry}
            >
              Спробувати ще
            </button>
          </div>
        )}
        {state.status === "success" && visibleTasks.length === 0 && (
          <p className="task-list__empty" role="status">
            За цими фільтрами завдань немає.
          </p>
        )}
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <li
              className={
                task.completed ? "task-item task-item--completed" : "task-item"
              }
              key={task.id}
            >
              <input
                className="task-item__checkbox"
                type="checkbox"
                checked={task.completed}
                disabled={saving}
                aria-label={`Змінити стан: ${task.title}`}
                onChange={() => {
                  if (!isAuthenticated) navigate("/login?next=%2Ftasks");
                  else void updateTask(task, { completed: !task.completed });
                }}
              />
              <div className="task-item__content">
                <h2 className="task-item__title">
                  <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                </h2>
                <span className="task-item__status">
                  {task.completed ? "Виконано" : "Не виконано"}
                </span>
              </div>
              <Link
                className="button button--secondary"
                to={`/tasks/${task.id}`}
              >
                Деталі
              </Link>
            </li>
          ))}
        </ul>
        <nav className="task-board__pagination" aria-label="Сторінки завдань">
          <button
            className="button button--secondary"
            type="button"
            disabled={page === 0}
            onClick={() => setPage((value) => value - 1)}
          >
            Попередня
          </button>
          <span>
            Сторінка {page + 1}
            {pageCount !== null && ` з ${pageCount}`}
          </span>
          <button
            className="button button--secondary"
            type="button"
            disabled={pageCount === null || page + 1 >= pageCount}
            onClick={() => setPage((value) => value + 1)}
          >
            Наступна
          </button>
        </nav>
      </div>
      {creating && isAuthenticated && (
        <TaskFormDialog
          mode="create"
          onClose={() => setCreating(false)}
          onSubmit={submit}
        />
      )}
    </section>
  );
}
