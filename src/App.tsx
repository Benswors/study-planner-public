import { useState } from 'react'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import TaskStats from './components/TaskStats'
import TaskFilters from './components/TaskFilters'
import TaskList from './components/TaskList'
import { initialTasks } from './data/initialTasks'
import type { Task, TaskFilter, TaskInput } from './types/task'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const completed = tasks.filter(task => task.completed).length
  const counts = { all: tasks.length, completed, active: tasks.length - completed }
  const visibleTasks = tasks.filter(task => filter === 'all' || (filter === 'completed' ? task.completed : !task.completed))

  function addTask(input: TaskInput) {
    const task: Task = { ...input, id: crypto.randomUUID(), completed: false }
    setTasks(previous => [task, ...previous])
  }

  function toggleTask(id: string) {
    setTasks(previous => previous.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  function deleteTask(id: string) {
    setTasks(previous => previous.filter(task => task.id !== id))
  }

  return (
    <div className="app">
      <Header />
      <main className="planner">
        <TaskForm onAdd={addTask} />
        <section className="planner__tasks" aria-label="Навчальні завдання">
          <TaskStats counts={counts} />
          <div className="task-board">
            <TaskFilters value={filter} counts={counts} onChange={setFilter} />
            <TaskList tasks={visibleTasks} totalCount={tasks.length} onToggle={toggleTask} onDelete={deleteTask} />
          </div>
        </section>
      </main>
    </div>
  )
}
