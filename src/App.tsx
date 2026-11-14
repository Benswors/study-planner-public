import './App.scss'
import { useState } from 'react'
import Header from './components/Header'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import Toast from './components/Toast'
import { useTaskContext } from './hooks/useTaskContext'
import { TASK_FILTERS } from './types/task'
import type { TaskCounts } from './types/task'

export default function App() {
  const { tasks, resetTasks } = useTaskContext()
  const [resetCount, setResetCount] = useState(0)
  const counts = Object.fromEntries(
    TASK_FILTERS.map((option) => [
      option.value,
      tasks.filter(option.matches).length,
    ]),
  ) as TaskCounts

  function resetPlanner() {
    resetTasks()
    setResetCount((count) => count + 1)
  }

  return (
    <div className="app">
      <Header />
      <main className="planner">
        <TaskForm key={resetCount} />
        <section className="planner__tasks" aria-label="Навчальні завдання">
          <TaskStats counts={counts} />
          <div className="task-board">
            <div className="task-board__toolbar">
              <TaskFilters counts={counts} />
              <button className="button button--secondary" type="button" onClick={resetPlanner}>
                Скинути дані
              </button>
            </div>
            <TaskList key={resetCount} />
          </div>
        </section>
      </main>
      <Toast />
    </div>
  )
}
