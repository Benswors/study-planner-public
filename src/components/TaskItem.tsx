import type { Priority, Task } from '../types/task'
interface TaskItemProps { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void }
const priorityLabels: Record<Priority, string> = { low: 'Низький', medium: 'Середній', high: 'Високий' }

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
      <input className="task-item__checkbox" type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} aria-label={`${task.completed ? 'Повернути в невиконані' : 'Позначити виконаним'}: ${task.title}`} />
      <div className="task-item__content">
        <h3 className="task-item__title">{task.title}</h3>
        {task.description && <p className="task-item__description">{task.description}</p>}
        <div className="task-item__meta"><span className="task-item__category">{task.category}</span><span className={`task-item__priority task-item__priority--${task.priority}`}>{priorityLabels[task.priority]}</span><span className="task-item__status">{task.completed ? 'Виконано' : 'Не виконано'}</span></div>
      </div>
      <button className="button button--danger" type="button" onClick={() => onDelete(task.id)} aria-label={`Видалити: ${task.title}`}>Видалити</button>
    </li>
  )
}
