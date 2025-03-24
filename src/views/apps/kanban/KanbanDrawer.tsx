// React Imports
import { useState, FormEvent, useEffect, useRef } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

// Type Imports
import type { TaskType, ColumnType } from '@/types/apps/kanbanTypes'
import type { AppDispatch } from '@/redux-store'
import { User } from '@/types/apps/userTypes'

// Component Imports
import QSimpleDatePicker from '@/@core/components/mui/QSimpleDatePicker'

// Slice Imports
import { updateTask, addTaskComment, uploadTaskAttachment, deleteTaskAttachment, deleteTaskComment } from '@/services/taskService'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import SimpleMemberSelector from '@/components/SimpleMemberSelector'
import moment from 'moment'
import axiosInstance from '@/libs/axios'
import DeleteAttachCommentConfirmation from './DeleteAttachCommentConfirmation'

// Add new types for comment and attachment
interface TaskComment {
  id: number
  task_id: number
  comment: string
  commented_by: number
  created_at: string
  updated_at: string
  user?: User // Optional user information if available
}

interface TaskAttachment {
  id: number
  task_id: number
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  uploaded_by: number
  created_at: string
  updated_at: string
  user?: User // Optional user information if available
}

type KanbanDrawerProps = {
  task: TaskType
  drawerOpen: boolean
  setDrawerOpen: (val: boolean) => void
  dispatch: AppDispatch
  columns: ColumnType[]
  setColumns: (val: ColumnType[]) => void
  fetchTasks: (id:number) => void
  employees: User[]
}

// Define a simplified type for assigned users if needed to match your API structure
interface SimpleUser {
  id: number
  name?: string
  src?: string
  avatar?: string
}

const KanbanDrawer = (props: KanbanDrawerProps) => {
  // Props
  const { task, drawerOpen, setDrawerOpen, dispatch, columns, setColumns, fetchTasks, employees } = props
  // Form hook
  const { control } = useForm()

  // Tab state
  const [tabValue, setTabValue] = useState(0)

  // Basic task states
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus] = useState(task.status || 'todo')
  const [priority, setPriority] = useState(task.priority || 'medium')
  const [dueDate, setDueDate] = useState<Date | null>(task.dueDate ? new Date(task.dueDate) : null)
  
  // New states for comments and attachments
  const [comments, setComments] = useState<TaskComment[]>([])
  const [attachments, setAttachments] = useState<TaskAttachment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'comment' | 'attachment'>('comment');
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Map any simplified users from task.assigned to full User objects
  const mapToFullUsers = (assignedUsers: SimpleUser[] | undefined): User[] => {
    if (!assignedUsers || !Array.isArray(assignedUsers)) return [];
    
    // For each simplified user, find the corresponding full user in employees
    return assignedUsers
      .map(simpleUser => {
        const fullUser = employees.find(emp => emp.id === simpleUser.id);
        return fullUser;
      })
      .filter((user): user is User => user !== undefined);
  };
  
  // Initialize assignedMembers with full User objects
  const [assignedMembers, setAssignedMembers] = useState<User[]>(
    mapToFullUsers(task.assigned as SimpleUser[])
  );

  const [error, setError] = useState<string>('')

  const params = useParams();
  const projectIdFromParams = params.projectId; 

  // Fetch task comments and attachments on drawer open
  useEffect(() => {
    if (drawerOpen && task.id) {
      fetchTaskDetails();
    }
  }, [drawerOpen, task.id]);

  // Fetch task comments and attachments
  const fetchTaskDetails = async () => {
    try {
      // Replace with your actual API endpoints
      const commentsResponse = await axiosInstance.get(`/web/tasks/${task.id}/comments`);
      const attachmentsResponse = await axiosInstance.get(`/web/tasks/${task.id}/attachments`);
      
      const commentsData = await commentsResponse.data?.data;
      const attachmentsData = await attachmentsResponse.data?.data;
      setComments(commentsData || []);
      setAttachments(attachmentsData || []);
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  // Handle Edit Task
  const handleEditTask = async (e: FormEvent) => {
    e.preventDefault()

    // Prepare data untuk update API
    const taskData = {
      title,
      description,
      status,
      priority,
      due_date: dueDate ? moment(dueDate).format('YYYY-MM-DD') : null, // Format YYYY-MM-DD
      assigned: assignedMembers.map(member => ({ id: member.id })) // Format the assigned members for API
    }

    try {
      // Panggil API untuk update task
      await updateTask(task.id, taskData)

      fetchTasks(Number(projectIdFromParams))
      // Don't close drawer to allow user to continue working with comments/attachments
      // setDrawerOpen(false)
    } catch (error) {
      console.error('Error updating task:', error)
      // Tambahkan notifikasi error jika diperlukan
      alert('Gagal memperbarui task. Silakan coba lagi.')
    }
  }

  // Handle add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmittingComment(true);
    
    try {
      const response = await addTaskComment(task.id, {
        comment: newComment
      });
      
      // Add the new comment to the list
      setComments([...comments, response.data]);
      setNewComment(''); // Clear the input
      fetchTasks(Number(projectIdFromParams))
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle delete comment
  const handleDeleteComment = (commentId: number) => {
    setDeleteType('comment');
    setItemToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploadingFile(true);
    
    const formData = new FormData();
    formData.append('file', files[0]);
    
    try {
      const response = await uploadTaskAttachment(task.id, formData);
      
      // Add the new attachment to the list
      setAttachments([...attachments, response.data]);
      fetchTasks(Number(projectIdFromParams))
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploadingFile(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle delete attachment
  const handleDeleteAttachment = (attachmentId: number) => {
    setDeleteType('attachment');
    setItemToDelete(attachmentId);
    setDeleteDialogOpen(true);
  };

  // Add this new function to handle the actual deletion:
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    
    try {
      if (deleteType === 'comment') {
        await deleteTaskComment(task.id, itemToDelete);
        setComments(comments.filter(comment => comment.id !== itemToDelete));
      } else {
        await deleteTaskAttachment(task.id, itemToDelete);
        setAttachments(attachments.filter(attachment => attachment.id !== itemToDelete));
      }
      
      fetchTasks(Number(projectIdFromParams));
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      alert(`Failed to delete ${deleteType}. Please try again.`);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };
  

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description || '')
    setStatus(task.status || 'todo')
    setPriority(task.priority || 'medium')
    setDueDate(task.dueDate ? new Date(task.dueDate) : null)
    
    // Update assignedMembers with full User objects when task changes
    setAssignedMembers(mapToFullUsers(task.assigned as SimpleUser[]))
  }, [task, employees, drawerOpen])

  const handleDateChange = (date: Date | null) => {
    setDueDate(date)
    // Clear error when a valid date is selected
    if (date) setError('')
  }

  const handleMemberChange = (members: User[]) => {
    // Ensure we're passing User[] type
    setAssignedMembers(members)
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  console.log({attachments})
  return (
    <Drawer
      anchor='right'
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{ style: { width: 450 } }}
    >
      <div className='p-6'>
        <div className='flex items-center justify-between mb-6'>
          <Typography variant='h6'>Task Details</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <i className='tabler-x' />
          </IconButton>
        </div>

        <Tabs value={tabValue} onChange={handleTabChange} aria-label="task tabs" className="mb-6">
          <Tab label="Details" />
          <Tab label="Comments" />
          <Tab label="Attachments" />
        </Tabs>

        {/* Details Tab */}
        {tabValue === 0 && (
          <form onSubmit={handleEditTask}>
            <div className='space-y-6'>
              <TextField 
                fullWidth 
                label='Title' 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
              />
              
              <TextField 
                fullWidth 
                label='Description' 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                multiline 
                rows={4}
              />
              
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label='Status'
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <MenuItem value='todo'>To Do</MenuItem>
                  <MenuItem value='in_progress'>In Progress</MenuItem>
                  <MenuItem value='in_review'>In Review</MenuItem>
                  <MenuItem value='done'>Done</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  label='Priority'
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <MenuItem value='low'>Low</MenuItem>
                  <MenuItem value='medium'>Medium</MenuItem>
                  <MenuItem value='high'>High</MenuItem>
                </Select>
              </FormControl>
              
              <QSimpleDatePicker
                name="dueDate"
                label="Due Date"
                value={dueDate}
                onChange={handleDateChange}
                required={true}
                error={!!error}
                helperText={error}
              />
              
              {/* Use the simplified MemberSelector component */}
              <SimpleMemberSelector
                label="Assign Members"
                placeholder="Select team members"
                employees={employees}
                value={assignedMembers}
                onChange={handleMemberChange}
                required={false}
              />
              
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant='outlined' onClick={() => setDrawerOpen(false)}>
                  Cancel
                </Button>
                <Button variant='contained' type='submit'>
                  Save Changes
                </Button>
              </Box>
            </div>
          </form>
        )}

        {/* Comments Tab */}
        {tabValue === 1 && (
          <div className="space-y-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <Typography variant="body2" color="textSecondary" className="text-center py-4">
                  No comments yet
                </Typography>
              ) : (
                comments.map((comment) => (
                  <Paper key={comment.id} elevation={1} className="p-3">
                    <Box className="flex justify-between items-start mb-2">
                      <Box className="flex items-center">
                        <Avatar 
                          src={comment.user?.avatar || '/images/avatars/1.png'} 
                          className="mr-2" 
                          sx={{ width: 32, height: 32 }}
                        />
                        <Box>
                          <Typography variant="subtitle2">
                            {comment.user ? `${comment.user.first_name} ${comment.user.last_name}` : 'User'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {moment(comment.created_at).format('MMM DD, YYYY HH:mm')}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteComment(comment.id)}
                        aria-label="delete comment"
                      >
                        <i className="tabler-trash" style={{ fontSize: '1rem' }} />
                      </IconButton>
                    </Box>
                    <Typography variant="body2">{comment.comment}</Typography>
                  </Paper>
                ))
              )}
            </div>
            
            <Divider />
            
            <Box className="flex items-start gap-2 pt-2">
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Button 
                variant="contained"
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmittingComment}
                sx={{ minWidth: '80px' }}
              >
                {isSubmittingComment ? 'Sending...' : 'Send'}
              </Button>
            </Box>
          </div>
        )}

        {/* Attachments Tab */}
        {tabValue === 2 && (
          <div className="space-y-4">
            <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
              {attachments.length === 0 ? (
                <Typography variant="body2" color="textSecondary" className="text-center py-4">
                  No attachments yet
                </Typography>
              ) : (
                <List>
                  {attachments.map((attachment) => (
                    <ListItem 
                      key={attachment.id}
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => handleDeleteAttachment(attachment.id)}
                        >
                          <i className="tabler-trash" />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <i className={getFileIcon(attachment.file_type)} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            component="a"
                            href={attachment.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              color: 'primary.main',
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            {attachment.file_name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Chip 
                              label={attachment.file_type.toUpperCase()} 
                              size="small"
                              sx={{ mr: 1, height: 20, fontSize: '0.625rem' }}
                            />
                            <Typography variant="caption" component="span" color="textSecondary">
                              {formatFileSize(attachment.file_size)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
            
            <Divider />
            
            <Box className="pt-2">
              <input
                accept="*/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  startIcon={<i className="tabler-upload" />}
                  disabled={isUploadingFile}
                >
                  {isUploadingFile ? 'Uploading...' : 'Upload Attachment'}
                </Button>
              </label>
            </Box>
          </div>
        )}

        <DeleteAttachCommentConfirmation
          open={deleteDialogOpen}
          title={`Delete ${deleteType}`}
          message={`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteDialogOpen(false)}
          isDeleting={isDeleting}
        />
      </div>
    </Drawer>
  )
}

// Helper function to get appropriate icon for file type
const getFileIcon = (fileType: string): string => {
  if (fileType.includes('image')) return 'tabler-photo';
  if (fileType.includes('pdf')) return 'tabler-file-type-pdf';
  if (fileType.includes('word') || fileType.includes('doc')) return 'tabler-file-type-doc';
  if (fileType.includes('excel') || fileType.includes('sheet')) return 'tabler-file-type-xls';
  if (fileType.includes('zip') || fileType.includes('rar')) return 'tabler-file-zip';
  return 'tabler-file';
};

export default KanbanDrawer
