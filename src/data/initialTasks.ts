import type { Task } from '../types/task'

export const initialTasks: Task[] = [
  { id: 'react-components', title: 'React Components', description: 'Опрацювати базові принципи компонентів React.', completed: false, priority: 'high', category: 'React' },
  { id: 'typescript-exercises', title: 'TypeScript Exercises', description: 'Виконати практичні вправи з типами та інтерфейсами.', completed: true, priority: 'medium', category: 'TypeScript' },
  { id: 'javascript-arrays', title: 'Повторити методи масивів', description: 'Попрактикувати map, filter та незмінне оновлення масивів.', completed: false, priority: 'low', category: 'JavaScript' },
]
