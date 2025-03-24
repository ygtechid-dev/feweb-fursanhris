import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { deleteTask } from '@/redux-store/slices/kanban';
import { deleteTaskApi } from '@/services/taskService';

type DeleteConfirmationProps = {
  open: boolean;
  onClose: () => void;
  taskId: number;
  taskTitle: string;
  dispatch: any;
  column: any;
  columns: any[];
  setColumns: (columns: any[]) => void;
  tasksList: any[];
  setTasksList: (tasks: any[]) => void;
};

const DeleteConfirmation = (props: DeleteConfirmationProps) => {
  const { 
    open, 
    onClose, 
    taskId, 
    taskTitle, 
    dispatch, 
    column, 
    columns, 
    setColumns, 
    tasksList, 
    setTasksList 
  } = props;
  
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTask = async () => {
    setIsDeleting(true);
    
    try {
      // Call the API to delete the task
      await deleteTaskApi(taskId);
      
      // Update redux state
      dispatch(deleteTask(taskId));

      // Update columns state
      const newColumns = columns.map(col => {
        if (col.id === column.id) {
          return { ...col, taskIds: col.taskIds.filter((id:number) => id !== taskId) };
        }
        return col;
      });
      
      setColumns(newColumns);
      
      // Update tasks list
      setTasksList(tasksList.filter(item => item?.id !== taskId));
      
      // Close the dialog
      onClose();
      
      // Show success notification (if you have a notification system)
      // toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      // Show error notification
      // toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Delete Task
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the task "{taskTitle}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button 
          onClick={handleDeleteTask} 
          color="error" 
          disabled={isDeleting}
          variant="contained"
          autoFocus
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
