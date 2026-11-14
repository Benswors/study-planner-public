import './TaskDetails.scss'
import { useCallback } from 'react'
import { useRequest } from '../hooks/useRequest'
import { taskRepository } from '../repositories/taskRepository'
import { PRIORITIES } from '../types/task'
import type { Task } from '../types/task'

interface TaskDetailsProps {
  task: Task
  edited: boolean
}

export default function TaskDetails({ task, edited }: TaskDetailsProps) {
  const { id } = task
  const load = useCallback(
    (signal: AbortSignal) => taskRepository.getById(id, signal),
    [id],
  )
  const { state, retry } = useRequest(load)
  const local = id.startsWith('local-')

  if (!local && state.status === 'loading') {
    return <p className="task-details" role="status">Завантаження деталей…</p>
  }

  if (!local && state.status === 'error') {
    return (
      <div className="task-details">
        <p role="alert">Не вдалося завантажити деталі. {state.message}</p>
        <button className="button button--secondary" type="button" onClick={retry}>
          Спробувати ще
        </button>
      </div>
    )
  }

  const details = !edited && state.status === 'success' && state.data
    ? state.data
    : task
  const priority = PRIORITIES.find((option) => option.value === details.priority)

  return (
    <dl className="task-details">
      <dt>Назва</dt><dd>{details.title}</dd>
      <dt>Опис</dt><dd>{details.description || 'Без опису'}</dd>
      <dt>Категорія</dt><dd>{details.category}</dd>
      <dt>Пріоритет</dt><dd>{priority?.label}</dd>
      <dt>Стан</dt><dd>{details.completed ? 'Виконано' : 'Не виконано'}</dd>
    </dl>
  )
}
