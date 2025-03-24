// React Imports
import { useEffect, useState } from 'react'
import type { FormEvent, RefObject } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'

// Third-party imports
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { animations } from '@formkit/drag-and-drop'
import classnames from 'classnames'

// Type Imports
import type { TaskType, ColumnType, KanbanType } from '@/types/apps/kanbanTypes'
import type { AppDispatch } from '@/redux-store'

// Slice Imports
import { addTask, editColumn, deleteColumn, updateColumnTaskIds } from '@/redux-store/slices/kanban'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import TaskCard from './TaskCard'
import NewTask from './NewTask'

// Styles Imports
import styles from './styles.module.css'
import { updateTaskOrder, updateTaskStatus, createTask } from '@/services/taskService'

type KanbanListProps = {
  column: ColumnType
  tasks: (TaskType | undefined)[]
  dispatch: AppDispatch
  store: KanbanType
  setDrawerOpen: (value: boolean) => void
  columns: ColumnType[]
  setColumns: (value: ColumnType[]) => void
  currentTask: TaskType | undefined
  projectId: number  // Added projectId prop
  openTaskDetails?: (taskId: number) => void 
}

const KanbanList = (props: KanbanListProps) => {
  // Props
  const { column, tasks, dispatch, store, setDrawerOpen, columns, setColumns, currentTask, projectId, openTaskDetails } = props

  // States
  const [editDisplay, setEditDisplay] = useState(false)
  const [title, setTitle] = useState(column.title)
  const [isAddingTask, setIsAddingTask] = useState(false)  // Track loading state

  // Hooks
  const [tasksListRef, tasksList, setTasksList] = useDragAndDrop(tasks, {
    group: 'tasksList',
    plugins: [animations()],
    draggable: el => el.classList.contains('item-draggable')
  })

  // Add New Task
  const addNewTask = async (taskTitle: string) => {
    setIsAddingTask(true)
    try {
      // First, update Redux state for immediate UI feedback
      dispatch(addTask({ columnId: column.id, title: taskTitle }))

      // Determine status based on column ID
      const statusMap: Record<number, string> = {
        1: 'todo',
        2: 'in_progress',
        3: 'in_review',
        4: 'done',
      }

      // Call the API to create the task on the server
      const response = await createTask({
        title: taskTitle,
        project_id: projectId,
        status: statusMap[column.id] || 'todo',
        priority: 'medium'
      })

      if (response && response.data) {
        const newTask = response.data

        // Update local taskList with the server-returned task (which has the actual ID)
        setTasksList([...tasksList, newTask])

        // Update columns state
        const newColumns = columns.map(col => {
          if (col.id === column.id) {
            return { ...col, taskIds: [...col.taskIds, newTask.id] }
          }
          return col
        })

        setColumns(newColumns)
      }
    } catch (error) {
      console.error('Failed to create task:', error)
      // You might want to add error handling here (e.g., show a notification)
    } finally {
      setIsAddingTask(false)
    }
  }

  // Handle Submit Edit
  const handleSubmitEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditDisplay(!editDisplay)
    dispatch(editColumn({ id: column.id, title }))

    const newColumn = columns.map(col => {
      if (col.id === column.id) {
        return { ...col, title }
      }

      return col
    })

    setColumns(newColumn)
  }

  // Cancel Edit
  const cancelEdit = () => {
    setEditDisplay(!editDisplay)
    setTitle(column.title)
  }

  // Delete Column
  const handleDeleteColumn = () => {
    dispatch(deleteColumn({ columnId: column.id }))
    setColumns(columns.filter(col => col.id !== column.id))
  }

  // Update column taskIds on drag and drop
  useEffect(() => {
    if (tasksList !== tasks) {
      // Extract taskIds from tasksList
      const taskIds = tasksList.filter(task => task !== undefined).map(task => task!.id);
      
      // Deteksi task yang baru ditambahkan ke kolom ini (perpindahan dari kolom lain)
      const originalTaskIds = tasks.filter(task => task !== undefined).map(task => task!.id);
      const newTasksInColumn = taskIds.filter(id => !originalTaskIds.includes(id));
      
      // Update status untuk task yang baru dipindahkan
      newTasksInColumn.forEach(taskId => {
        updateTaskStatus(taskId, column.id);
      });
      
      // Update Redux state
      dispatch(updateColumnTaskIds({ id: column.id, tasksList }));
      
      // Update backend untuk reordering
      if(taskIds && taskIds.length) updateTaskOrder(column.id, taskIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksList]);

  // To update the tasksList when a task is edited
  useEffect(() => {
    const newTasks = tasksList.map(task => {
      if (task?.id === currentTask?.id) {
        return currentTask
      }

      return task
    })

    if (currentTask !== tasksList.find(task => task?.id === currentTask?.id)) {
      setTasksList(newTasks)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTask])

  // To update the tasksList when columns are updated
  useEffect(() => {
    let taskIds: ColumnType['taskIds'] = []

    columns.map(col => {
      taskIds = [...taskIds, ...col.taskIds]
    })

    const newTasksList = tasksList.filter(task => task && taskIds.includes(task.id))

    setTasksList(newTasksList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])

  return (
    <div ref={tasksListRef as RefObject<HTMLDivElement>} className='flex flex-col is-[16.5rem]'>
      {editDisplay ? (
        <form
          className='flex items-center mbe-4'
          onSubmit={handleSubmitEdit}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              cancelEdit()
            }
          }}
        >
          <InputBase value={title} autoFocus onChange={e => setTitle(e.target.value)} required className='flex-auto' />
          <IconButton color='success' size='small' type='submit'>
            <i className='tabler-check' />
          </IconButton>
          <IconButton color='error' size='small' type='reset' onClick={cancelEdit}>
            <i className='tabler-x' />
          </IconButton>
        </form>
      ) : (
        <div
          id='no-drag'
          className={classnames(
            'flex items-center justify-between is-[16.5rem] bs-[2.125rem] mbe-4',
            styles.kanbanColumn
          )}
        >
          <Typography variant='h5' noWrap className='max-is-[80%]'>
            {column.title}
          </Typography>
          {/* <div className='flex items-center'>
            <i className={classnames('tabler-arrows-move text-textSecondary list-handle', styles.drag)} />
            <OptionMenu
              iconClassName='text-xl text-textPrimary'
              options={[
                {
                  text: 'Edit',
                  icon: 'tabler-pencil',
                  menuItemProps: {
                    className: 'flex items-center gap-2',
                    onClick: () => setEditDisplay(!editDisplay)
                  }
                },
                {
                  text: 'Delete',
                  icon: 'tabler-trash',
                  menuItemProps: { className: 'flex items-center gap-2', onClick: handleDeleteColumn }
                }
              ]}
            />
          </div> */}
        </div>
      )}
      {tasksList.map(
        task =>
          task && (
            <TaskCard
              key={task.id}
              task={task}
              dispatch={dispatch}
              column={column}
              setColumns={setColumns}
              columns={columns}
              setDrawerOpen={setDrawerOpen}
              tasksList={tasksList}
              setTasksList={setTasksList}
              openTaskDetails={openTaskDetails} // Add this prop
            />
          )
      )}
      <NewTask 
        addTask={addNewTask} 
        isLoading={isAddingTask} 
      />
    </div>
  )
}

export default KanbanList
