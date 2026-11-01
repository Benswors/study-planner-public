import type { TaskCounts, TaskFilter } from '../types/task'
interface TaskFiltersProps { value: TaskFilter; counts: TaskCounts; onChange: (filter: TaskFilter) => void }
const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' }, { value: 'active', label: 'Не виконані' }, { value: 'completed', label: 'Виконані' },
]

export default function TaskFilters({ value, counts, onChange }: TaskFiltersProps) {
  return (
    <div className="task-filters" role="group" aria-label="Фільтр завдань">
      {filters.map(filter => (
        <button key={filter.value} className={`task-filters__button${value === filter.value ? ' task-filters__button--active' : ''}`} type="button" aria-pressed={value === filter.value} onClick={() => onChange(filter.value)}>
          {filter.label}<span className="task-filters__count">{counts[filter.value]}</span>
        </button>
      ))}
    </div>
  )
}
