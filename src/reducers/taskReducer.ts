import { initialTasks } from '../data/initialTasks'
import type { Task, TaskInput } from '../types/task'

export interface PendingDelete {
  id: string
  deadline: number
}

export interface TaskState {
  tasks: Task[]
  pendingDelete: PendingDelete | null
}

export type TaskAction =
  | { type: 'add'; task: Task }
  | { type: 'toggle'; id: string }
  | { type: 'update'; id: string; values: TaskInput }
  | { type: 'requestDelete'; pendingDelete: PendingDelete }
  | { type: 'confirmDelete'; pendingDelete: PendingDelete }
  | { type: 'undoDelete' }
  | { type: 'reset' }

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add':
      return { ...state, tasks: [action.task, ...state.tasks] }
    case 'toggle':
      if (state.pendingDelete?.id === action.id) return state

      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task,
        ),
      }
    case 'update':
      if (state.pendingDelete?.id === action.id) return state

      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, ...action.values } : task,
        ),
      }
    case 'requestDelete':
      if (state.pendingDelete) return state
      return { ...state, pendingDelete: action.pendingDelete }
    case 'confirmDelete':
      if (state.pendingDelete !== action.pendingDelete) return state

      return {
        tasks: state.tasks.filter((task) => task.id !== action.pendingDelete.id),
        pendingDelete: null,
      }
    case 'undoDelete':
      return { ...state, pendingDelete: null }
    case 'reset':
      return { tasks: initialTasks, pendingDelete: null }
  }
}
