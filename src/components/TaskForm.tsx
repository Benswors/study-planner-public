import './TaskForm.scss'
import { useId, useState } from 'react'
import type { SubmitEvent } from 'react'
import { DEFAULT_PRIORITY, PRIORITIES } from '../types/task'
import type { Task, TaskInput } from '../types/task'

interface TaskFormProps {
  task?: Task
  busy: boolean
  onSave: (values: TaskInput) => Promise<boolean>
  onCancel?: () => void
}
const emptyValues: TaskInput = {
  title: '',
  description: '',
  category: '',
  priority: DEFAULT_PRIORITY,
}

export default function TaskForm({ task, busy, onSave, onCancel }: TaskFormProps) {
  const formId = useId()
  const [values, setValues] = useState<TaskInput>(() =>
    task
      ? {
          title: task.title,
          description: task.description,
          category: task.category,
          priority: task.priority,
        }
      : emptyValues,
  )
  const [error, setError] = useState('')

  function changePriority(value: string) {
    const priority = PRIORITIES.find((option) => option.value === value)
    if (!priority) return

    setValues((previous) => ({ ...previous, priority: priority.value }))
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const title = values.title.trim()
    if (!title) {
      setError('Вкажіть назву завдання.')
      return
    }
    const input: TaskInput = {
      title,
      description: values.description.trim(),
      category: values.category.trim() || 'Загальне',
      priority: values.priority,
    }

    if (!(await onSave(input))) return

    if (task) {
      onCancel?.()
      return
    }

    setValues(emptyValues)
    setError('')
  }

  return (
    <section className="task-form">
      <h2 className="task-form__heading">
        {task ? 'Редагування завдання' : 'Нове завдання'}
      </h2>
      <form className="task-form__fields" noValidate onSubmit={submit}>
        <div className="task-form__field">
          <label className="task-form__label" htmlFor={`${formId}-task-title`}>
            Назва <span aria-hidden="true">*</span>
          </label>
          <input
            disabled={busy}
            id={`${formId}-task-title`}
            className="task-form__input"
            value={values.title}
            maxLength={120}
            required
            placeholder="Наприклад, опрацювати props"
            aria-invalid={!!error}
            aria-describedby={error ? `${formId}-title-error` : undefined}
            onChange={(event) => {
              setValues({ ...values, title: event.target.value })
              if (error) setError('')
            }}
          />
          {error && (
            <p id={`${formId}-title-error`} className="task-form__error" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="task-form__field">
          <label className="task-form__label" htmlFor={`${formId}-task-description`}>
            Опис
          </label>
          <textarea
            disabled={busy}
            id={`${formId}-task-description`}
            className="task-form__input task-form__input--textarea"
            value={values.description}
            maxLength={500}
            rows={4}
            placeholder="Що потрібно зробити?"
            onChange={(event) =>
              setValues({ ...values, description: event.target.value })
            }
          />
        </div>
        <div className="task-form__field">
          <label className="task-form__label" htmlFor={`${formId}-task-category`}>
            Категорія
          </label>
          <input
            disabled={busy}
            id={`${formId}-task-category`}
            className="task-form__input"
            value={values.category}
            maxLength={40}
            placeholder="Наприклад, React"
            onChange={(event) =>
              setValues({ ...values, category: event.target.value })
            }
          />
        </div>
        <div className="task-form__field">
          <label className="task-form__label" htmlFor={`${formId}-task-priority`}>
            Пріоритет
          </label>
          <select
            disabled={busy}
            id={`${formId}-task-priority`}
            className="task-form__input"
            value={values.priority}
            onChange={(event) => changePriority(event.target.value)}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
        <div className="task-form__actions">
          <button className="button button--primary" type="submit" disabled={busy}>
            {busy ? 'Зачекайте…' : task ? 'Зберегти' : 'Додати'}
          </button>
          {task && (
            <button className="button button--secondary" type="button" disabled={busy} onClick={onCancel}>
              Скасувати редагування
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
