import './TaskList.scss'
import { useTaskContext } from '../hooks/useTaskContext'
import { TASK_FILTERS } from '../types/task'
import TaskItem from './TaskItem'

export default function TaskList() {
  const { tasks, filter } = useTaskContext()
  const selectedFilter =
    TASK_FILTERS.find((option) => option.value === filter) ?? TASK_FILTERS[0]
  const visibleTasks = tasks.filter(selectedFilter.matches)

  if (tasks.length === 0) {
    return (
      <div className="task-list__empty" role="status">
        <p className="task-list__empty-title">Завдань поки немає.</p>
        <p>Додайте перше навчальне завдання.</p>
      </div>
    )
  }

  if (visibleTasks.length === 0) {
    return (
      <p className="task-list__empty" role="status">
        За цим фільтром завдань немає.
      </p>
    )
  }

  return (
    <ul className="task-list">
      {visibleTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}
