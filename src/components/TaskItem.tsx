import './TaskItem.scss'
import { useState } from 'react'
import { useTaskContext } from '../hooks/useTaskContext'
import TaskForm from './TaskForm'
import { PRIORITIES } from '../types/task'
import type { Task } from '../types/task'
export default function TaskItem({ task }: { task: Task }) {
  const { pendingDelete, toggleTask, requestDelete } = useTaskContext()
  const [editing, setEditing] = useState(false)
  const pending = pendingDelete?.id === task.id
  const className = [
    'task-item',
    task.completed ? 'task-item--completed' : '',
    pending ? 'task-item--pending' : '',
  ].filter(Boolean).join(' ')

  const priority =
    PRIORITIES.find((option) => option.value === task.priority) ?? PRIORITIES[0]
  const toggleLabel = task.completed
    ? 'Повернути в невиконані'
    : 'Позначити виконаним'

  return (
    <li className={className}>
      <input
        className="task-item__checkbox"
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task.id)}
        disabled={pending}
        aria-label={`${toggleLabel}: ${task.title}`}
      />
      <div className="task-item__content">
        <h3 className="task-item__title">{task.title}</h3>
        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}
        <div className="task-item__meta">
          <span className="task-item__category">{task.category}</span>
          <span className={`task-item__priority ${priority.className}`}>
            {priority.label}
          </span>
          <span className="task-item__status">
            {pending ? 'Буде видалено' : task.completed ? 'Виконано' : 'Не виконано'}
          </span>
        </div>
        {editing && !pending && (
          <div className="task-item__edit">
            <TaskForm task={task} onCancel={() => setEditing(false)} />
          </div>
        )}
      </div>
      <div className="task-item__actions">
        <button
          className="button button--secondary"
          type="button"
          disabled={pending || editing}
          onClick={() => setEditing(true)}
          aria-label={`Редагувати: ${task.title}`}
        >
          Редагувати
        </button>
        <button
          className="button button--danger"
          type="button"
          disabled={pending || editing}
          onClick={() => requestDelete(task.id)}
          aria-label={`Видалити: ${task.title}`}
        >
          Видалити
        </button>
      </div>
    </li>
  )
}
