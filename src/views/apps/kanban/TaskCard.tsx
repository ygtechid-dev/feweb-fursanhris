import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import AvatarGroup from '@mui/material/AvatarGroup'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import classnames from 'classnames'

// Type Imports
import type { TaskType, ColumnType } from '@/types/apps/kanbanTypes'
import type { AppDispatch } from '@/redux-store'

// Slice Imports
import { getCurrentTask } from '@/redux-store/slices/kanban'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import DeleteConfirmation from './DeleteConfirmation'

// Styles Imports
import styles from './styles.module.css'

// Helper function to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

// Helper function to get priority color
const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'error'
    case 'medium':
      return 'warning'
    case 'low':
      return 'success'
    default:
      return 'primary'
  }
}

// Add openTaskDetails to the props interface
type TaskCardProps = {
  task: TaskType
  dispatch: AppDispatch
  column: ColumnType
  setColumns: (value: ColumnType[]) => void
  columns: ColumnType[]
  setDrawerOpen: (value: boolean) => void
  tasksList: (TaskType | undefined)[]
  setTasksList: (value: (TaskType | undefined)[]) => void
  openTaskDetails?: (taskId: number) => void // New prop
}

// Modify the function signature to include the new prop
const TaskCard = (props: TaskCardProps) => {
  // Props
  const { 
    task, 
    dispatch, 
    column, 
    setColumns, 
    columns, 
    setDrawerOpen, 
    tasksList, 
    setTasksList,
    openTaskDetails 
  } = props

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // Open delete confirmation dialog
  const openDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteDialogOpen(true)
  }
  
  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
  }

  // Open drawer to view task details
  const handleTaskClick = () => {
    dispatch(getCurrentTask(task.id))
    setDrawerOpen(true)
  }

  // Handle view details button click
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the card click event
    if (openTaskDetails) {
      openTaskDetails(task.id)
    }
  }

  return (
    <>
      <Card
        onClick={handleTaskClick}
        className={classnames('item-draggable mb-4 cursor-pointer', styles.kanbanCard)}
      >
        <CardContent className='relative p-4'>
          {/* Priority Badge */}
          {task.priority && (
            <div className='absolute top-4 right-4'>
              <Chip 
                size="small" 
                label={task.priority.toUpperCase()} 
                color={getPriorityColor(task.priority) as any}
              />
            </div>
          )}
          
          <Typography 
            variant='h6' 
            className='mb-2'
            sx={{ 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              maxWidth: 'calc(100% - 80px)'
            }}
          >
            {task.title}
          </Typography>
          
          {task.description && (
            <Typography variant='body2' className='mb-4 line-clamp-2 text-textSecondary'>
              {task.description}
            </Typography>
          )}
          
          <div className='flex flex-wrap items-center justify-between gap-2'>
            {task.dueDate && (
              <div className='flex items-center gap-1'>
                <i className='tabler-calendar-event text-textSecondary' />
                <Typography variant='caption'>
                  {task.dueDate ? formatDate(new Date(task.dueDate)) : ''}
                </Typography>
              </div>
            )}
            
            <div className='flex items-center gap-2 ms-auto'>
              <div className='flex items-center'>
                <Badge badgeContent={task.attachments || null} color='primary'>
                  <i className='tabler-paperclip text-textSecondary' />
                </Badge>
              </div>
              
              <div className='flex items-center'>
                <Badge badgeContent={task.comments|| null} color='primary'>
                  <i className='tabler-message-circle text-textSecondary' />
                </Badge>
              </div>
              
              <div onClick={(e) => e.stopPropagation()}>
                <OptionMenu
                  iconButtonProps={{ className: 'text-textSecondary' }}
                  iconClassName='text-xl'
                  options={[
                    {
                      text: 'View Details',
                      icon: 'tabler-eye',
                      menuItemProps: { 
                        className: 'flex items-center gap-2',
                        onClick: handleViewDetails // Add view details option
                      }
                    },
                    {
                      text: 'Delete Task',
                      icon: 'tabler-trash',
                      menuItemProps: { 
                        className: 'flex items-center gap-2',
                        onClick: openDeleteDialog
                      }
                    }
                  ]}
                />
              </div>
            </div>
          </div>
          
          {task.assigned && task.assigned.length > 0 && (
            <AvatarGroup max={4} className='mt-4'>
              {task.assigned.map((user, index) => 
                <Avatar key={index} alt={user.name} src={user.src || '/images/avatars/1.png'} />
              )}
            </AvatarGroup>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        taskId={task.id}
        taskTitle={task.title}
        dispatch={dispatch}
        column={column}
        columns={columns}
        setColumns={setColumns}
        tasksList={tasksList}
        setTasksList={setTasksList}
      />
    </>
  )
}

export default TaskCard
