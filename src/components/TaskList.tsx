import type { Task } from '../types/task'
import TaskItem from './TaskItem'
interface TaskListProps { tasks: Task[]; totalCount: number; onToggle: (id: string) => void; onDelete: (id: string) => void }

export default function TaskList({ tasks, totalCount, onToggle, onDelete }: TaskListProps) {
  if (totalCount === 0) return <div className="task-list__empty" role="status"><p className="task-list__empty-title">Завдань поки немає.</p><p>Додайте перше навчальне завдання.</p></div>
  if (tasks.length === 0) return <p className="task-list__empty" role="status">За цим фільтром завдань немає.</p>
  return <ul className="task-list">{tasks.map(task => <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />)}</ul>
}
