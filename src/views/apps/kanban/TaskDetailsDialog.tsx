// React Imports
import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { forwardRef } from 'react'

// Component Imports
import TaskDetailsView from './TaskDetailsView'
import KanbanDrawer from './KanbanDrawer'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux-store'
import { useParams } from 'next/navigation'
import { User } from '@/types/apps/userTypes'
import { getCurrentTask } from '@/redux-store/slices/kanban'

// Transition component for dialog
const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface TaskDetailsDialogProps {
  open: boolean
  onClose: () => void
  taskId: number
  columns: any[]
  setColumns: (columns: any[]) => void
  fetchTasks: (id: number) => void
  employees: User[]
    setDrawerOpen: (value: boolean) => void
}

const TaskDetailsDialog = ({ 
  open, 
  onClose, 
  taskId, 
  columns, 
  setColumns,
  fetchTasks,
  employees,
  setDrawerOpen
}: TaskDetailsDialogProps) => {
  // States
  const [isEditing, setIsEditing] = useState(false)
  
  // Hooks
  const dispatch = useDispatch()
  const params = useParams()
  const projectId = params.projectId
  
  // Get the task from Redux store
  const task = useSelector((state: RootState) => 
    state.kanbanReducer.tasks.find(t => t.id === taskId)
  )
  
  // Set current task in Redux when editing
  const handleEditClick = () => {
    if (taskId) {
      dispatch(getCurrentTask(taskId))
      setDrawerOpen(true)
    //   setIsEditing(false)
        handleDialogClose()
    }
  }
  
  // Close the edit drawer
  const handleCloseEdit = () => {
    setIsEditing(false)
  }
  
  // Handle dialog close
  const handleDialogClose = () => {
    setIsEditing(false)
    onClose()
  }

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogClose}
        aria-describedby="task-details-dialog"
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <TaskDetailsView 
            taskId={taskId} 
            onEdit={handleEditClick}
            onClose={handleDialogClose}
            isDialog
          />
        </DialogContent>
      </Dialog>
      
      {/* Render KanbanDrawer for editing if task exists */}
      {/* {task && isEditing && (
        <KanbanDrawer
          task={task}
          drawerOpen={isEditing}
          setDrawerOpen={handleCloseEdit}
          dispatch={dispatch}
          columns={columns}
          setColumns={setColumns}
          fetchTasks={fetchTasks}
          employees={employees}
        />
      )} */}
    </>
  )
}

export default TaskDetailsDialog
