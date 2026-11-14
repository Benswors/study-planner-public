import './TaskItem.scss'
import { useState } from 'react'
import { PRIORITIES } from '../types/task'
import type { Task, TaskInput } from '../types/task'
import TaskDetails from './TaskDetails'
import TaskForm from './TaskForm'

interface TaskItemProps {
  task: Task
  edited: boolean
  busy: boolean
  onSave: (values: TaskInput) => Promise<boolean>
  onToggle: () => Promise<boolean>
  onDelete: () => Promise<boolean>
}

export default function TaskItem({ task, edited, busy, onSave, onToggle, onDelete }: TaskItemProps) {
  const [panel, setPanel] = useState<'details' | 'edit' | 'delete' | null>(null)
  const priority = PRIORITIES.find((option) => option.value === task.priority) ?? PRIORITIES[0]
  const toggleLabel = task.completed ? 'Повернути в невиконані' : 'Позначити виконаним'

  return (
    <li className={task.completed ? 'task-item task-item--completed' : 'task-item'}>
      <input
        className="task-item__checkbox"
        type="checkbox"
        checked={task.completed}
        onChange={() => void onToggle()}
        disabled={busy || panel === 'delete'}
        aria-label={`${toggleLabel}: ${task.title}`}
      />
      <div className="task-item__content">
        <h3 className="task-item__title">{task.title}</h3>
        {task.description && <p className="task-item__description">{task.description}</p>}
        <div className="task-item__meta">
          <span className="task-item__category">{task.category}</span>
          <span className={`task-item__priority ${priority.className}`}>{priority.label}</span>
          <span className="task-item__status">{task.completed ? 'Виконано' : 'Не виконано'}</span>
        </div>
        {panel === 'details' && <TaskDetails task={task} edited={edited} />}
        {panel === 'edit' && (
          <div className="task-item__edit">
            <TaskForm task={task} busy={busy} onSave={onSave} onCancel={() => setPanel(null)} />
          </div>
        )}
        {panel === 'delete' && (
          <div className="task-item__confirm">
            <p>Видалити це завдання?</p>
            <button className="button button--danger" type="button" disabled={busy} onClick={() => void onDelete()}>
              Підтвердити
            </button>
            <button className="button button--secondary" type="button" disabled={busy} onClick={() => setPanel(null)}>
              Скасувати
            </button>
          </div>
        )}
      </div>
      <div className="task-item__actions">
        <button
          className="button button--secondary"
          type="button"
          disabled={busy}
          aria-expanded={panel === 'details'}
          onClick={() => setPanel(panel === 'details' ? null : 'details')}
        >
          Деталі
        </button>
        <button className="button button--secondary" type="button" disabled={busy || panel === 'edit'} onClick={() => setPanel('edit')}>
          Редагувати
        </button>
        <button className="button button--danger" type="button" disabled={busy || panel === 'delete'} onClick={() => setPanel('delete')}>
          Видалити
        </button>
      </div>
    </li>
  )
}
