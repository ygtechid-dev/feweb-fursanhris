'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import { useMediaQuery } from '@mui/material'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import { useDispatch, useSelector } from 'react-redux'
import type { EventInput } from '@fullcalendar/core'

// Type Imports
import type { CalendarColors, CalendarType } from '@/types/apps/calendarTypes'
import type { TaskType } from '@/types/apps/kanbanTypes'

// Component Imports
import Calendar from './Calendar'
import SidebarLeft from './SidebarLeft'
import AddEventSidebar from './AddEventSidebar'

// Service Imports
import { createTask, updateTask, deleteTaskApi } from '@/services/taskService'
import axiosInstance from '@/libs/axios'
import { useParams } from 'next/navigation'
import { ApiResponse, ApiTask } from '../kanban/KanbanBoard'
import moment from 'moment'

// CalendarColors Object
const calendarsColor: CalendarColors = {
  todo: 'secondary',
  in_progress: 'info',
  in_review: 'warning',
  done: 'success'
}

// Helper function to convert tasks to calendar events
const convertTasksToEvents = (tasks: TaskType[]): EventInput[] => {
  return tasks.filter((task) => task.dueDate).map(task => {
    return {
      id: task.id.toString(),
      title: task.title,
      start: task.dueDate ? new Date(task.dueDate) : new Date(),
      end: task.dueDate ? new Date(task.dueDate) : new Date(),
      allDay: true,
      extendedProps: {
        description: task.description || '',
        calendar: mapCalendarToStatus(task.status || ''),
        priority: task.priority,
        assignedTo: task.assigned?.map(user => user.name).join(', '),
        taskId: task.id,
        isTask: true
      }
    }
  })
}

// Helper function to map task status to calendar categories
const mapStatusToCalendar = (status?: string) => {
  switch(status) {
    case 'todo': return 'Todo'
    case 'in_progress': return 'InProgress'
    case 'in_review': return 'InReview'
    case 'done': return 'Done'
    default: return 'Todo'
  }
}

// Helper function to map calendar categories to task status
const mapCalendarToStatus = (calendar: string) => {
  switch(calendar) {
    case 'Todo': return 'todo'
    case 'InProgress': return 'in_progress'
    case 'InReview': return 'in_review'
    case 'Done': return 'done'
    default: return 'todo'
  }
  
}

const AppCalendar = () => {
  // States
  const [calendarApi, setCalendarApi] = useState<null | any>(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState<boolean>(false)
  const [tasks, setTasks] = useState<TaskType[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Hooks
  const dispatch = useDispatch()
  const calendarStore = useSelector((state: { calendarReducer: CalendarType }) => state.calendarReducer)
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const params = useParams();
  const projectIdFromParams = params.projectId; 

  // Fetch tasks and convert to calendar events on component mount
  useEffect(() => {
    fetchTasks()
  }, [calendarStore.events])

  // Function to fetch tasks
  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/web/projects/${projectIdFromParams}/tasks`)
      
      const data: ApiResponse = await response.data
      const taskEvents = data?.data.map((event: ApiTask) => ({
        id: event.id,
        title: event.title as string,
        description: event?.description || '',
        status: mapStatusToCalendar(event.status),
        priority: event?.priority || 'medium',
        dueDate: event.due_date,
        assigned: event?.assignees.map(assignee => ({
          id: assignee.id,
          src: assignee.avatar || '/images/avatars/1.png',
          name: `${assignee.first_name} ${assignee.last_name}`
        })),
      }))
      
      setTasks(taskEvents as TaskType[])

      // Update calendar events with task data
      const taskEventData = convertTasksToEvents(taskEvents as TaskType[])
      dispatch({ type: 'calendar/setEvents', payload: taskEventData })
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle creating a new task/event
  const handleCreateTask = async (eventData: any) => {
    try {
      const taskData = {
        title: eventData.title,
        project_id: Number(projectIdFromParams),
        status: mapCalendarToStatus(eventData.extendedProps.calendar),
        priority: eventData.extendedProps.priority || 'medium',
        due_date: moment(eventData.start).format('YYYY-MM-DD'),
        description: eventData.extendedProps.description || '',
        assigned: eventData.extendedProps.guests ? 
          eventData.extendedProps.guests.map((guest: any) => ({ id: guest.id })) : []
      }
      
      const response = await createTask(taskData)
      // Update local state with new task
      if (response && response.data) {
        const newTask = response.data
        setTasks(prev => [...prev, newTask])
        
        // Convert to calendar event and add to calendar
        const newEvent = convertTasksToEvents([newTask])[0]
        dispatch({ type: 'calendar/addEvent', payload: newEvent })
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  // Function to handle updating a task/event
  const handleUpdateTask = async (eventData: any) => {
    console.log({eventData})
    try {
      // Check if this is a task event
      if (!eventData.extendedProps?.isTask) {
        // Handle as regular event
        dispatch({ type: 'calendar/updateEvent', payload: eventData })
        return
      }
      
      const taskId = eventData.extendedProps.taskId || parseInt(eventData.id)
      const taskData = {
        title: eventData.title,
        status: mapCalendarToStatus(eventData.extendedProps.calendar),
        priority: eventData.extendedProps.priority || 'medium',
        due_date: moment(eventData.start).format('YYYY-MM-DD'),
        description: eventData.extendedProps.description || ''
      }
      
      await updateTask(taskId, taskData)
      
      // Update local task state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...taskData } : task
      ))
      
      // Update calendar event
      dispatch({ type: 'calendar/updateEvent', payload: eventData })
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  // Function to handle deleting a task/event
  const handleDeleteTask = async (eventId: string) => {
    try {
      const taskId = parseInt(eventId)
      await deleteTaskApi(taskId)
      
      // Update local task state
      setTasks(prev => prev.filter(task => task.id !== taskId))
      
      // Remove from calendar
      dispatch({ type: 'calendar/deleteEvent', payload: eventId })
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleAddEventSidebarToggle = () => setAddEventSidebarOpen(!addEventSidebarOpen)

  return (
    <>
      <SidebarLeft
        mdAbove={mdAbove}
        dispatch={dispatch}
        calendarApi={calendarApi}
        calendarStore={calendarStore}
        calendarsColor={calendarsColor}
        leftSidebarOpen={leftSidebarOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
      />
      <div className='p-6 pbe-0 flex-grow overflow-visible bg-backgroundPaper rounded'>
        <Calendar
          dispatch={dispatch}
          calendarApi={calendarApi}
          calendarStore={{
            ...calendarStore,
            // Combine regular events with task events
            events: [...calendarStore.events, ...convertTasksToEvents(tasks)]
          }}
          setCalendarApi={setCalendarApi}
          calendarsColor={calendarsColor}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
          onEventCreate={handleCreateTask}
          onEventUpdate={handleUpdateTask}
          onEventDelete={handleDeleteTask}
        />
      </div>
      <AddEventSidebar
        dispatch={dispatch}
        calendarApi={calendarApi}
        calendarStore={calendarStore}
        addEventSidebarOpen={addEventSidebarOpen}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
        onEventCreate={handleCreateTask}
        onEventUpdate={handleUpdateTask}
        onEventDelete={handleDeleteTask}
        calendarsColor={calendarsColor}
      />
    </>
  )
}

export default AppCalendar
