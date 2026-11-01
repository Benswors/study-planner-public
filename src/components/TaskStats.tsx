import type { TaskCounts } from '../types/task'
interface TaskStatsProps { counts: TaskCounts }

export default function TaskStats({ counts }: TaskStatsProps) {
  return (
    <dl className="task-stats" aria-label="Статистика завдань" aria-live="polite" aria-atomic="true">
      <div className="task-stats__item"><dt className="task-stats__label">Усього</dt><dd className="task-stats__value">{counts.all}</dd></div>
      <div className="task-stats__item"><dt className="task-stats__label">Не виконані</dt><dd className="task-stats__value">{counts.active}</dd></div>
      <div className="task-stats__item"><dt className="task-stats__label">Виконані</dt><dd className="task-stats__value task-stats__value--completed">{counts.completed}</dd></div>
    </dl>
  )
}
