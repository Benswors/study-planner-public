import './App.scss'
import { useEffect } from 'react'
import Header from './components/Header'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import Toast from './components/Toast'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTasks } from './hooks/useTasks'
import { DEFAULT_FILTER, TASK_FILTERS } from './types/task'
import type { TaskCounts, TaskFilter, TaskInput } from './types/task'

function isFilter(value: unknown): value is TaskFilter {
  return TASK_FILTERS.some((option) => option.value === value)
}

export default function App() {
  const {
    state, page, pageCount, setPage, retry, tasks, changes, saving, message,
    addTask, updateTask, deleteTask,
  } = useTasks()
  const [filter, setFilter] = useLocalStorage('study-planner.filter', DEFAULT_FILTER, isFilter)
  const selectedFilter = TASK_FILTERS.find((option) => option.value === filter) ?? TASK_FILTERS[0]
  const counts = Object.fromEntries(
    TASK_FILTERS.map((option) => [option.value, tasks.filter(option.matches).length]),
  ) as TaskCounts

  useEffect(() => {
    document.title = `Study Planner — ${counts.active} active on this page`
    return () => { document.title = 'Study Planner' }
  }, [counts.active])

  async function createTask(input: TaskInput) {
    const saved = await addTask(input)
    if (saved) setFilter(DEFAULT_FILTER)
    return saved
  }

  return (
    <div className="app">
      <Header />
      <main className="planner">
        <div>
          <TaskForm onSave={createTask} busy={saving} />
          <p className="planner__note">Зміни діють до перезавантаження сторінки.</p>
        </div>
        <section className="planner__tasks" aria-label="Навчальні завдання">
          <div className="planner__summary">
            <p>Статистика на цій сторінці</p>
            <TaskStats counts={counts} />
          </div>
          <div className="task-board">
            <div className="task-board__toolbar">
              <TaskFilters value={filter} onChange={setFilter} counts={counts} />
            </div>

            {state.status === 'loading' && (
              <p className="task-board__status" role="status">Завантаження завдань…</p>
            )}
            {state.status === 'error' && (
              <div className="task-board__status">
                <p role="alert">Не вдалося завантажити завдання. {state.message}</p>
                <button className="button button--secondary" type="button" onClick={retry}>
                  Спробувати ще
                </button>
              </div>
            )}
            {(state.status === 'success' || tasks.length > 0) && (
              <TaskList
                tasks={tasks.filter(selectedFilter.matches)}
                totalCount={tasks.length}
                changes={changes}
                busy={saving}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            )}

            <nav className="task-board__pagination" aria-label="Сторінки завдань">
              <button
                className="button button--secondary"
                type="button"
                disabled={page === 0}
                onClick={() => setPage((previous) => previous - 1)}
              >
                Попередня
              </button>
              <span>Сторінка {page + 1}{pageCount !== null && ` з ${pageCount}`}</span>
              <button
                className="button button--secondary"
                type="button"
                disabled={pageCount === null || page + 1 >= pageCount}
                onClick={() => setPage((previous) => previous + 1)}
              >
                Наступна
              </button>
            </nav>
          </div>
        </section>
      </main>
      {message && <Toast key={message.text} {...message} />}
    </div>
  )
}
