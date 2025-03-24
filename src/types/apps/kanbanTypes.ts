// export type TaskType = {
//   id: number
//   title: string
//   badgeText?: string[]
//   attachments?: number
//   comments?: number
//   assigned?: { src: string; name: string }[]
//   image?: string
//   dueDate?: Date
//   status?: string | 'in_progress' | 'todo' | 'done'
//   priority?: string | 'low' | 'medium' | 'high'
//   description?: string
// }

// export type ColumnType = {
//   id: number
//   title: string
//   taskIds: number[]
// }

// export type KanbanType = {
//   columns: ColumnType[]
//   tasks: TaskType[]
//   currentTaskId?: number
// }


export interface TaskType {
  id: number
  title: string
  description: string
  status: string
  priority: string
  badgeText: string[]
  attachments: number
  comments: number
  assigned: Array<{
    id: number
    src: string
    name: string
  }>
  dueDate: Date | string
  position?: number
  created_at?: string
  updated_at?: string
}

export type ColumnType = {
  id: number
  title: string
  taskIds: number[]
}

export type KanbanType = {
  tasks: TaskType[]
  columns: ColumnType[]
  currentTaskId?: number
}
