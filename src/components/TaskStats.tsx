import "./TaskStats.scss";
import { TASK_FILTERS } from "../types/task";
import type { TaskCounts } from "../types/task";

interface TaskStatsProps {
  counts: TaskCounts;
}

export default function TaskStats({ counts }: TaskStatsProps) {
  return (
    <dl
      className="task-stats"
      aria-label="Статистика завдань"
      aria-live="polite"
      aria-atomic="true"
    >
      {TASK_FILTERS.map((filter) => (
        <div key={filter.value} className="task-stats__item">
          <dt className="task-stats__label">{filter.summaryLabel}</dt>
          <dd
            className={["task-stats__value", filter.statsClassName].join(" ")}
          >
            {counts[filter.value]}
          </dd>
        </div>
      ))}
    </dl>
  );
}
