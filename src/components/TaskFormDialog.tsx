import "./TaskFormDialog.scss";
import "./TaskForm.scss";
import { useEffect, useId, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "../schemas/taskSchema";
import type { TaskFormData } from "../schemas/taskSchema";
import { DEFAULT_PRIORITY, PRIORITIES } from "../types/task";
import type { Task, TaskInput } from "../types/task";

interface TaskFormDialogProps {
  mode: "create" | "edit";
  task?: Task;
  onClose: () => void;
  onSubmit: (data: TaskInput) => Promise<boolean>;
}

export default function TaskFormDialog({
  mode,
  task,
  onClose,
  onSubmit,
}: TaskFormDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useId();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      category: task?.category ?? "",
      priority: task?.priority ?? DEFAULT_PRIORITY,
    },
  });

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  async function submit(data: TaskFormData) {
    const saved = await onSubmit({
      ...data,
      category: data.category || "Загальне",
    });
    if (saved) onClose();
  }

  return (
    <dialog
      ref={dialog}
      className="task-dialog"
      aria-labelledby={heading}
      onCancel={(event) => {
        if (isSubmitting) event.preventDefault();
        else onClose();
      }}
    >
      <form
        className="task-form__fields"
        noValidate
        onSubmit={handleSubmit(submit)}
      >
        <h2 id={heading} className="task-form__heading">
          {mode === "create" ? "Нове завдання" : "Редагування завдання"}
        </h2>
        <fieldset className="task-dialog__fields" disabled={isSubmitting}>
          <label className="task-form__field">
            <span className="task-form__label">Назва</span>
            <input
              className="task-form__input"
              autoFocus
              {...register("title")}
              aria-label="Назва"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <span className="task-form__error" role="alert">
                {errors.title.message}
              </span>
            )}
          </label>
          <label className="task-form__field">
            <span className="task-form__label">Опис</span>
            <textarea
              className="task-form__input task-form__input--textarea"
              rows={4}
              {...register("description")}
              aria-label="Опис"
            />
            {errors.description && (
              <span className="task-form__error" role="alert">
                {errors.description.message}
              </span>
            )}
          </label>
          <label className="task-form__field">
            <span className="task-form__label">Категорія</span>
            <input className="task-form__input" aria-label="Категорія" {...register("category")} />
            {errors.category && (
              <span className="task-form__error" role="alert">
                {errors.category.message}
              </span>
            )}
          </label>
          <label className="task-form__field">
            <span className="task-form__label">Пріоритет</span>
            <select className="task-form__input" aria-label="Пріоритет" {...register("priority")}>
              {PRIORITIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="task-form__actions">
            <button className="button button--primary" type="submit">
              {isSubmitting ? "Збереження…" : "Зберегти"}
            </button>
            <button
              className="button button--secondary"
              type="button"
              onClick={onClose}
            >
              Скасувати
            </button>
          </div>
        </fieldset>
      </form>
    </dialog>
  );
}
