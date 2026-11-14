import { useEffect, useReducer, useState } from 'react'
import type { ReactNode } from 'react'
import { initialTasks } from '../data/initialTasks'
import { readStorage, useLocalStorage, writeStorage } from '../hooks/useLocalStorage'
import { taskReducer } from '../reducers/taskReducer'
import type { TaskState } from '../reducers/taskReducer'
import { DEFAULT_FILTER, PRIORITIES, TASK_FILTERS } from '../types/task'
import type { Task, TaskFilter, TaskInput } from '../types/task'
import { TaskContext } from './TaskContext'
import type { ToastMessage } from './TaskContext'

const TASKS_KEY = 'study-planner.tasks'
const FILTER_KEY = 'study-planner.filter'
const DELETE_DELAY = 5000
const TOAST_DELAY = 3000

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false

  const task = value as Partial<Task>
  return (
    typeof task.id === 'string' &&
    task.id.length > 0 &&
    typeof task.title === 'string' &&
    task.title.trim().length > 0 &&
    typeof task.description === 'string' &&
    typeof task.category === 'string' &&
    typeof task.completed === 'boolean' &&
    PRIORITIES.some((priority) => priority.value === task.priority)
  )
}

function isTaskList(value: unknown): value is Task[] {
  return (
    Array.isArray(value) &&
    value.every(isTask) &&
    new Set(value.map((task) => task.id)).size === value.length
  )
}

function isFilter(value: unknown): value is TaskFilter {
  return TASK_FILTERS.some((option) => option.value === value)
}

function loadTasks(): TaskState {
  return {
    tasks: readStorage(TASKS_KEY, initialTasks, isTaskList),
    pendingDelete: null,
  }
}

export default function TaskProvider({ children }: { children: ReactNode }) {
  const [{ tasks, pendingDelete }, dispatch] = useReducer(
    taskReducer,
    undefined,
    loadTasks,
  )
  const [filter, setFilter] = useLocalStorage(FILTER_KEY, DEFAULT_FILTER, isFilter)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const activeCount = tasks.filter((task) => !task.completed).length

  useEffect(() => {
    writeStorage(TASKS_KEY, tasks)
  }, [tasks])

  useEffect(() => {
    document.title = `Study Planner — ${activeCount} active tasks`
  }, [activeCount])

  useEffect(() => {
    if (!pendingDelete) return

    const timer = window.setTimeout(() => {
      dispatch({ type: 'confirmDelete', pendingDelete })
      setToast({ kind: 'success', text: 'Завдання видалено.' })
    }, Math.max(0, pendingDelete.deadline - Date.now()))

    return () => window.clearTimeout(timer)
  }, [pendingDelete])

  useEffect(() => {
    if (!toast) return

    const timer = window.setTimeout(() => setToast(null), TOAST_DELAY)
    return () => window.clearTimeout(timer)
  }, [toast])

  function addTask(values: TaskInput) {
    const task: Task = { ...values, id: crypto.randomUUID(), completed: false }
    dispatch({ type: 'add', task })
    setToast({ kind: 'success', text: 'Завдання додано.' })
  }

  function updateTask(id: string, values: TaskInput) {
    if (pendingDelete?.id === id || !tasks.some((task) => task.id === id)) {
      setToast({ kind: 'error', text: 'Не вдалося зберегти завдання.' })
      return false
    }

    dispatch({ type: 'update', id, values })
    setToast({ kind: 'success', text: 'Зміни збережено.' })
    return true
  }

  function toggleTask(id: string) {
    dispatch({ type: 'toggle', id })
  }

  function requestDelete(id: string) {
    if (pendingDelete) {
      setToast({ kind: 'error', text: 'Завершіть попереднє видалення.' })
      return
    }

    dispatch({
      type: 'requestDelete',
      pendingDelete: { id, deadline: Date.now() + DELETE_DELAY },
    })
  }

  function undoDelete() {
    dispatch({ type: 'undoDelete' })
    setToast({ kind: 'success', text: 'Видалення скасовано.' })
  }

  function resetTasks() {
    dispatch({ type: 'reset' })
    setFilter(DEFAULT_FILTER)
    setToast({ kind: 'success', text: 'Початкові дані відновлено.' })
  }

  return (
    <TaskContext
      value={{
        tasks,
        filter,
        setFilter,
        addTask,
        updateTask,
        toggleTask,
        requestDelete,
        undoDelete,
        resetTasks,
        pendingDelete,
        toast,
      }}
    >
      {children}
    </TaskContext>
  )
}
