import "./TaskFilters.scss";
import { TASK_FILTERS } from "../types/task";
import type { TaskCounts, TaskFilter } from "../types/task";
interface TaskFiltersProps {
  counts: TaskCounts;
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
}

export default function TaskFilters({
  counts,
  value,
  onChange,
}: TaskFiltersProps) {
  return (
    <div className="task-filters" role="group" aria-label="Фільтр завдань">
      {TASK_FILTERS.map((filter) => (
        <button
          key={filter.value}
          className={[
            "task-filters__button",
            value === filter.value ? "task-filters__button--active" : "",
          ].join(" ")}
          type="button"
          aria-pressed={value === filter.value}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
          <span className="task-filters__count">{counts[filter.value]}</span>
        </button>
      ))}
    </div>
  );
}
