import { useState } from 'react'
import type { SubmitEvent } from 'react'
import type { Priority, TaskInput } from '../types/task'

interface TaskFormProps { onAdd: (task: TaskInput) => void }
const emptyValues: TaskInput = { title: '', description: '', category: '', priority: 'medium' }

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [values, setValues] = useState<TaskInput>(emptyValues)
  const [error, setError] = useState('')

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = values.title.trim()
    if (!title) { setError('Вкажіть назву завдання.'); return }
    onAdd({ title, description: values.description.trim(), category: values.category.trim() || 'Загальне', priority: values.priority })
    setValues(emptyValues)
    setError('')
  }

  return (
    <section className="task-form">
      <h2 className="task-form__heading">Нове завдання</h2>
      <form className="task-form__fields" noValidate onSubmit={submit}>
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-title">Назва <span aria-hidden="true">*</span></label>
          <input id="task-title" className="task-form__input" value={values.title} maxLength={120} required placeholder="Наприклад, опрацювати props" aria-invalid={!!error} aria-describedby={error ? 'title-error' : undefined} onChange={event => { setValues({ ...values, title: event.target.value }); if (error) setError('') }} />
          {error && <p id="title-error" className="task-form__error" role="alert">{error}</p>}
        </div>
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-description">Опис</label>
          <textarea id="task-description" className="task-form__input task-form__input--textarea" value={values.description} maxLength={500} rows={4} placeholder="Що потрібно зробити?" onChange={event => setValues({ ...values, description: event.target.value })} />
        </div>
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-category">Категорія</label>
          <input id="task-category" className="task-form__input" value={values.category} maxLength={40} placeholder="Наприклад, React" onChange={event => setValues({ ...values, category: event.target.value })} />
        </div>
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-priority">Пріоритет</label>
          <select id="task-priority" className="task-form__input" value={values.priority} onChange={event => setValues({ ...values, priority: event.target.value as Priority })}>
            <option value="low">Низький</option><option value="medium">Середній</option><option value="high">Високий</option>
          </select>
        </div>
        <button className="button button--primary" type="submit">Додати</button>
      </form>
    </section>
  )
}
