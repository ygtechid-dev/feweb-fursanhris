'use client'
// React Imports
import type { RefObject } from 'react'
import { useEffect, useState } from 'react'
// Third-party imports
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { animations } from '@formkit/drag-and-drop'
import { useDispatch, useSelector } from 'react-redux'
// Type Imports
import type { RootState } from '@/redux-store'
import type { TaskType, ColumnType } from '@/types/apps/kanbanTypes'
// Slice Imports

// Component Imports
import KanbanList from './KanbanList'
import KanbanDrawer from './KanbanDrawer'
import { addColumn, setColumns, setTasks, updateColumns } from '@/redux-store/slices/kanban'
import { Button } from '@mui/material'
import axiosInstance from '@/libs/axios'
import { useParams } from 'next/navigation'
import { User } from '@/types/apps/userTypes'
import { getUsers } from '@/services/userService'
import TaskDetailsDialog from './TaskDetailsDialog'

// Define API task type
export interface ApiTask {
  id: number
  project_id: number
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  created_by: number
  position: number
  created_at: string
  updated_at: string
  deleted_at: null | string
  project: {
    id: number
    name: string
    description: string
    start_date: string
    end_date: string
    status: string
    created_by: number
    created_at: string
    updated_at: string
    deleted_at: null | string
  }
  assignees: Array<{
    id: number
    first_name: string
    last_name: string
    email: string
    email_verified_at: string
    type: string
    company_id: null | number
    avatar: string
    lang: string
    plan: null | string
    plan_expire_date: null | string
    storage_limit: number
    last_login: null | string
    is_active: number
    active_status: number
    is_login_enable: number
    dark_mode: number
    messenger_color: string
    is_disable: number
    created_by: string
    created_at: string
    updated_at: string
    pivot: {
      task_id: number
      user_id: number
      created_at: string
      updated_at: string
    }
  }>
  attachments: Array<{
    id: number
    task_id: number
    file_name: string
    file_path: string
    file_type: string
    file_size: number
    uploaded_by: number
    created_at: string
    updated_at: string
  }>
  comments: Array<{
    id: number
    task_id: number
    comment: string
    commented_by: number
    created_at: string
    updated_at: string
  }>
}
export interface ApiResponse {
  status: boolean
  message: string
  data: ApiTask[]
}

const KanbanBoard = () => {
  // All state declarations first
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<number | null>(null)
  const [employees, setEmployees] = useState<User[]>([])

  // Add these new state variables in the KanbanBoard component
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)

  // Add this function to open the task details dialog
  const openTaskDetails = (taskId: number) => {
    setSelectedTaskId(taskId)
    setDetailsDialogOpen(true)
  }

  // Add this function to close the task details dialog
  const closeTaskDetails = () => {
    setDetailsDialogOpen(false)
    setSelectedTaskId(null)
  }
  
  // All hooks next
  const kanbanStore = useSelector((state: RootState) => state.kanbanReducer)
  const dispatch = useDispatch()
  const params = useParams();
  const projectIdFromParams = params.projectId; 
  
  const [boardRef, columns, setColumnsState] = useDragAndDrop(kanbanStore.columns, {
    plugins: [animations()],
    dragHandle: '.list-handle'
  })
  
  // Get the current task for the drawer
  const currentTask = kanbanStore.tasks.find(task => task.id === kanbanStore.currentTaskId)

  // Function to convert API tasks to Kanban format
  const convertApiTasksToKanban = (apiTasks: ApiTask[]) => {
    const statusGroups: Record<string, number[]> = {
      'todo': [],
      'in_progress': [],
      'in_review': [],
      'done': [],
    }

    
    // Group task IDs by status
    apiTasks.forEach(task => {
      const status = task.status.toLowerCase()
      if (!statusGroups[status]) {
        statusGroups[status] = []
      }
      statusGroups[status].push(task.id)
    })
    
    // Create columns based on status groups
    const kanbanColumns: ColumnType[] = Object.entries(statusGroups).map(([status, taskIds], index) => {
      return {
        id: index + 1,
        title: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()), // Convert to title case
        taskIds: taskIds
      }
    })
    
    // Convert API tasks to Kanban tasks
    const kanbanTasks: TaskType[] = apiTasks.map(apiTask => {
      return {
        id: apiTask.id,
        title: apiTask.title,
        description: apiTask.description,
        badgeText: [apiTask.priority.toUpperCase()],
        attachments: apiTask.attachments.length,
        comments: apiTask.comments.length,
        assigned: apiTask.assignees.map(assignee => ({
          id: assignee.id,
          src: assignee.avatar || '/images/avatars/1.png',
          name: `${assignee.first_name} ${assignee.last_name}`
        })),
        dueDate: apiTask.due_date ? new Date(apiTask.due_date) : '',
        status: apiTask.status,
        priority: apiTask.priority
      }
    })
    
    return { columns: kanbanColumns, tasks: kanbanTasks }
  }
  
  // Fetch tasks from API
  const fetchTasks = async (id: number) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await axiosInstance.get(`/web/projects/${id}/tasks`)
      
      const data: ApiResponse = await response.data
    
      if (data.status && data.data) {
        const { columns, tasks } = convertApiTasksToKanban(data.data)
        
        // Update Redux store
        dispatch(setTasks(tasks))
        dispatch(setColumns(columns))
        
        // Update local state
        setColumnsState(columns)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      setError((err as Error).message)
      console.error('Error fetching tasks:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Add New Column
  const addNewColumn = (title: string) => {
    const maxId = Math.max(...kanbanStore.columns.map(column => column.id))
    dispatch(addColumn(title))
    setColumnsState([...columns, { id: maxId + 1, title, taskIds: [] }])
  }
  
  // All useEffect hooks grouped together
  // 1. Fetch tasks when projectId changes
  useEffect(() => {
    if (projectIdFromParams) {
      setProjectId(Number(projectIdFromParams));
      fetchTasks(Number(projectIdFromParams));
    }
  }, [projectIdFromParams]);
  
  // 2. Update Columns on Drag and Drop
  useEffect(() => {
    if (columns !== kanbanStore.columns) dispatch(updateColumns(columns))
  }, [columns, dispatch, kanbanStore.columns]);
  
  // 3. Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getUsers();
        setEmployees(response.data)
      } catch (error) {
        console.error('Error fetching team members:', error)
      }
    }
    
    fetchEmployees()
  }, []);
  
  // Conditional rendering after all hooks
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading tasks...</div>
  }
  
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() => projectId && fetchTasks(projectId)}>Retry</Button>
      </div>
    )
  }
  
  // Main component render
  return (
    <div className='flex flex-col'>
      <div className='flex items-start gap-6 overflow-x-auto pb-6'>
        <div ref={boardRef as RefObject<HTMLDivElement>} className='flex gap-6'>
          {columns.map(column => (
            <KanbanList
              key={column.id}
              dispatch={dispatch}
              column={column}
              store={kanbanStore}
              setDrawerOpen={setDrawerOpen}
              columns={columns}
              setColumns={setColumnsState}
              currentTask={currentTask}
              tasks={column.taskIds.map(taskId => kanbanStore.tasks.find(task => task.id === taskId))}
              projectId={Number(projectIdFromParams)}
              openTaskDetails={openTaskDetails} // Add this prop
            />
          ))}
        </div>
        {/* <NewColumn addNewColumn={addNewColumn} /> */}
      </div>
      
      {currentTask && (
        <KanbanDrawer
          task={currentTask}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          dispatch={dispatch}
          columns={columns}
          setColumns={setColumnsState}
          fetchTasks={fetchTasks}
          employees={employees} 
        />
      )}

      {selectedTaskId && (
        <TaskDetailsDialog
          open={detailsDialogOpen}
          onClose={closeTaskDetails}
          taskId={selectedTaskId}
          columns={columns}
          setColumns={setColumnsState}
          fetchTasks={fetchTasks}
          employees={employees}
          // dispatch={dispatch}
          setDrawerOpen={setDrawerOpen}
        />
      )}
    </div>
  )
}

export default KanbanBoard
