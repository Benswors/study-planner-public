import './TaskFilters.scss'
import { TASK_FILTERS } from '../types/task'
import { useTaskContext } from '../hooks/useTaskContext'
import type { TaskCounts } from '../types/task'
export default function TaskFilters({ counts }: { counts: TaskCounts }) {
  const { filter: selectedFilter, setFilter } = useTaskContext()

  return (
    <div className="task-filters" role="group" aria-label="Фільтр завдань">
      {TASK_FILTERS.map((filter) => (
        <button
          key={filter.value}
          className={[
            'task-filters__button',
            selectedFilter === filter.value ? 'task-filters__button--active' : '',
          ].join(' ')}
          type="button"
          aria-pressed={selectedFilter === filter.value}
          onClick={() => setFilter(filter.value)}
        >
          {filter.label}
          <span className="task-filters__count">{counts[filter.value]}</span>
        </button>
      ))}
    </div>
  )
}
