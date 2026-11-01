export type Priority = 'low' | 'medium' | 'high'
export type TaskFilter = 'all' | 'active' | 'completed'

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  category: string
}

export type TaskInput = Omit<Task, 'id' | 'completed'>
export interface TaskCounts { all: number; active: number; completed: number }
