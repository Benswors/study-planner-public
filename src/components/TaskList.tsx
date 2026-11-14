import './TaskList.scss'
import type { Task, TaskInput } from '../types/task'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  totalCount: number
  changes: Record<string, Task | null>
  busy: boolean
  onUpdate: (task: Task, changes: Partial<TaskInput> & { completed?: boolean }) => Promise<boolean>
  onDelete: (task: Task) => Promise<boolean>
}

export default function TaskList({
  tasks, totalCount, changes, busy, onUpdate, onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="task-list__empty" role="status">
        {totalCount === 0 ? 'Завдань на цій сторінці немає.' : 'За цим фільтром завдань немає.'}
      </p>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          edited={Boolean(changes[task.id])}
          busy={busy}
          onSave={(values) => onUpdate(task, values)}
          onToggle={() => onUpdate(task, { completed: !task.completed })}
          onDelete={() => onDelete(task)}
        />
      ))}
    </ul>
  )
}
