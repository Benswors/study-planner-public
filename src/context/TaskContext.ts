import { createContext } from 'react'
import type { PendingDelete } from '../reducers/taskReducer'
import type { Task, TaskFilter, TaskInput } from '../types/task'

export interface ToastMessage {
  text: string
  kind: 'success' | 'error'
}

interface TaskContextValue {
  tasks: Task[]
  filter: TaskFilter
  setFilter: (filter: TaskFilter) => void
  addTask: (values: TaskInput) => void
  updateTask: (id: string, values: TaskInput) => boolean
  toggleTask: (id: string) => void
  requestDelete: (id: string) => void
  undoDelete: () => void
  resetTasks: () => void
  pendingDelete: PendingDelete | null
  toast: ToastMessage | null
}

export const TaskContext = createContext<TaskContextValue | null>(null)
