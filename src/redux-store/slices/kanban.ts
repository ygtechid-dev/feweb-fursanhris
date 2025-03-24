// Third-party Imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// Type Imports
import type { ColumnType, TaskType, KanbanType } from '@/types/apps/kanbanTypes'
// Data Imports
import { db } from '@/fake-db/apps/kanban'

export const kanbanSlice = createSlice({
  name: 'kanban',
  initialState: db,
  reducers: {
    // Add setTasks and setColumns actions for API data
    setTasks: (state, action: PayloadAction<TaskType[]>) => {
      state.tasks = action.payload
    },
    setColumns: (state, action: PayloadAction<ColumnType[]>) => {
      state.columns = action.payload
    },
    addColumn: (state, action) => {
      const maxId = Math.max(...state.columns.map(column => column.id))
      const newColumn: ColumnType = {
        id: maxId + 1,
        title: action.payload,
        taskIds: []
      }
      state.columns.push(newColumn)
    },
    editColumn: (state, action) => {
      const { id, title } = action.payload
      const column = state.columns.find(column => column.id === id)
      if (column) {
        column.title = title
      }
    },
    deleteColumn: (state, action) => {
      const { columnId } = action.payload
      const column = state.columns.find(column => column.id === columnId)
      state.columns = state.columns.filter(column => column.id !== columnId)
      if (column) {
        state.tasks = state.tasks.filter(task => !column.taskIds.includes(task.id))
      }
    },
    updateColumns: (state, action) => {
      state.columns = action.payload
    },
    updateColumnTaskIds: (state, action) => {
      const { id, tasksList } = action.payload
      state.columns = state.columns.map(column => {
        if (column.id === id) {
          return { ...column, taskIds: tasksList.map((task: TaskType) => task.id) }
        }
        return column
      })
    },
    addTask: (state, action) => {
      const { columnId, title } = action.payload
      
      // Find the max task ID to ensure uniqueness
      const maxId = state.tasks.length > 0 
        ? Math.max(...state.tasks.map(task => task.id)) 
        : 0
        
      const newTask: TaskType = {
        id: maxId + 1,
        title,
        description: '',
        status: '',
        priority: '',
        badgeText: [],
        attachments: 0,
        comments: 0,
        assigned: [],
        dueDate: ''
      }
      const column = state.columns.find(column => column.id === columnId)
      if (column) {
        column.taskIds.push(newTask.id)
      }
      state.tasks.push(newTask)
      return state
    },
    editTask: (state, action) => {
      console.log("")
      const { id, title, badgeText, dueDate, status, priority, description } = action.payload
      const task = state.tasks.find(task => task.id === id)
      if (task) {
        task.title = title || task.title
        if (badgeText) task.badgeText = badgeText
        if (dueDate) task.dueDate = dueDate
        if (status) task.status = status
        if (priority) task.priority = priority
        if (description) task.description = description
        
        // If status changed, update column taskIds
        if (status) {
          // Find the column that has the task's status
          const targetColumn = state.columns.find(column => 
            column.title.toLowerCase() === status.replace('_', ' ').toLowerCase()
          )
          
          // Find the column that currently contains the task
          const sourceColumn = state.columns.find(column => 
            column.taskIds.includes(id)
          )
          
          // Move task from source to target column
          if (sourceColumn && targetColumn && sourceColumn.id !== targetColumn.id) {
            sourceColumn.taskIds = sourceColumn.taskIds.filter(taskId => taskId !== id)
            targetColumn.taskIds.push(id)
          }
        }
      }
    },
    deleteTask: (state, action) => {
      const taskId = action.payload
      state.tasks = state.tasks.filter(task => task.id !== taskId)
      state.columns = state.columns.map(column => {
        return {
          ...column,
          taskIds: column.taskIds.filter(id => id !== taskId)
        }
      })
    },
    getCurrentTask: (state, action) => {
      state.currentTaskId = action.payload
    }
  }
})

export const {
  addColumn,
  editColumn,
  deleteColumn,
  updateColumns,
  updateColumnTaskIds,
  addTask,
  editTask,
  deleteTask,
  getCurrentTask,
  setTasks,
  setColumns
} = kanbanSlice.actions

export default kanbanSlice.reducer
