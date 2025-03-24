import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Link from '@mui/material/Link'
import { ApiTask } from './KanbanBoard'
import { formatTaskDate, getPriorityColor, getStatusLabel, getTaskDetails } from '@/services/taskDetailService'
import { User } from '@/types/apps/userTypes'
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent'

// Component Imports

interface TaskDetailsViewProps {
  taskId: number
  onEdit?: () => void
  onClose?: () => void
  isDialog?: boolean
}

// Helper function to calculate file size display
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper function to get file icon based on type
const getFileIcon = (fileType: string): string => {
  if (fileType.includes('image')) return 'tabler-photo'
  if (fileType.includes('pdf')) return 'tabler-file-type-pdf'
  if (fileType.includes('word') || fileType.includes('doc')) return 'tabler-file-type-doc'
  if (fileType.includes('excel') || fileType.includes('sheet') || fileType.includes('csv')) return 'tabler-file-type-xlsx'
  if (fileType.includes('zip') || fileType.includes('rar')) return 'tabler-file-zipper'
  
  return 'tabler-file'
}

const TaskDetailsView = ({ taskId, onEdit, onClose, isDialog = false }: TaskDetailsViewProps) => {
  // States
  const [task, setTask] = useState<ApiTask | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [commentUsers, setCommentUsers] = useState<Record<number, { name: string, avatar: string }>>({})

  // Fetch task details
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const taskData = await getTaskDetails(taskId)
        setTask(taskData)
        
        // Create a map of user IDs to user info for comments
        if (taskData.comments.length > 0) {
          const userMap: Record<number, { name: string, avatar: string }> = {}
          
          // We'll use assignees as a potential source of user data
          taskData.assignees.forEach((user: User) => {
            userMap[user.id] = {
              name: `${user.first_name} ${user.last_name}`,
              avatar: user.avatar || '/images/avatars/1.png'
            }
          })
          
          setCommentUsers(userMap)
        }
      } catch (err) {
        setError('Failed to load task details. Please try again.')
        console.error('Error in TaskDetailsView:', err)
      } finally {
        setLoading(false)
      }
    }

    if (taskId) {
      fetchTaskDetails()
    }
  }, [taskId])

  const handleDownload = (attachment: ApiTask['attachments'][0]) => {
    const downloadUrl = attachment.file_path
    
    // Try to fetch and download as blob
    try {
      fetch(downloadUrl)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok')
          return response.blob()
        })
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = attachment.file_name
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          // Clean up
          setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl)
          }, 100)
        })
        .catch(err => {
          console.warn('Falling back to alternative download method', err)
          // Fallback: Open in new tab
          window.open(downloadUrl, '_blank')
        })
    } catch (err) {
      console.warn('Error in download process, using fallback', err)
      // Fallback to simple method with target=_blank
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = attachment.file_name
      link.target = '_blank' // Prevents page navigation
      link.rel = 'noopener noreferrer' // Security best practice
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Format comment date
  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  if (!task) {
    return (
      <Box p={3}>
        <Alert severity="info">No task details found.</Alert>
      </Box>
    )
  }

  return (
    // <Card elevation={isDialog ? 0 : 1}>
    <>
      {isDialog && (
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
          <Typography variant="h5">Task Details</Typography>
          {onClose && (
            <IconButton onClick={onClose}>
              <i className="tabler-x" />
            </IconButton>
          )}
        </Box>
      )}
      
      <CardContent>
        <Box mb={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Typography variant="h5" gutterBottom>
                {task.title}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip 
                  size="small" 
                  label={getStatusLabel(task.status)} 
                  color="info" 
                />
                <Chip 
                  size="small" 
                  label={task.priority.toUpperCase()} 
                  color={getPriorityColor(task.priority) as any}
                />
                {task.due_date && (
                  <Chip 
                    size="small" 
                    icon={<i className="tabler-calendar-event" />} 
                    label={new Date(task.due_date).toLocaleDateString()} 
                  />
                )}
              </Box>
            </Grid>
            {onEdit && (
              <Grid item>
                <Button variant="outlined" onClick={onEdit}>
                  <i className="tabler-pencil me-2" />
                  Edit
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />
        
        {/* Project Information */}
        <Box mb={4}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Project
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body1" fontWeight="medium">
              {task.project.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {task.project.description}
            </Typography>
            <Box display="flex" gap={2} mt={1}>
              <Typography variant="caption" color="textSecondary">
                <i className="tabler-calendar me-1" />
                {new Date(task.project.start_date).toLocaleDateString()} - {new Date(task.project.end_date).toLocaleDateString()}
              </Typography>
              <Chip 
                size="small" 
                label={task.project.status.toUpperCase()}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Paper>
        </Box>

        {/* Task Description */}
        <Box mb={4}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Description
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2">
              {task.description || 'No description provided.'}
            </Typography>
          </Paper>
        </Box>

        {/* Assigned Members */}
        <Box mb={4}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Assigned To
          </Typography>
          {task.assignees.length > 0 ? (
            <List disablePadding>
              {task.assignees.map((assignee) => (
                <ListItem key={assignee.id} divider>
                  <ListItemAvatar>
                    <Avatar 
                      src={assignee.avatar || '/images/avatars/1.png'} 
                      alt={`${assignee.first_name} ${assignee.last_name}`} 
                    />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={`${assignee.first_name} ${assignee.last_name}`} 
                    secondary={assignee.email} 
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="textSecondary">
                No team members assigned.
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Attachments - Enhanced with download functionality */}
        {task.attachments.length > 0 && (
          <Box mb={4}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Attachments ({task.attachments.length})
            </Typography>
            <Grid container spacing={2}>
              {task.attachments.map((attachment) => (
                <Grid item xs={12} sm={6} md={4} key={attachment.id}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => handleDownload(attachment)}
                  >
                    <Box display="flex" flexDirection="column">
                      <Box display="flex" alignItems="center" mb={1}>
                        <i className={`${getFileIcon(attachment.file_type)} me-2`} style={{ fontSize: '1.5rem' }} />
                        <Tooltip title={attachment.file_name}>
                          <Typography variant="body2" fontWeight="medium" noWrap sx={{ flex: 1 }}>
                            {attachment.file_name}
                          </Typography>
                        </Tooltip>
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="textSecondary">
                          {formatFileSize(attachment.file_size)}
                        </Typography>
                        <Tooltip title="Download">
                          <IconButton size="small">
                            <i className="tabler-download" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Comments - Enhanced with better display */}
        {task.comments.length > 0 && (
          <Box mb={4}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Comments ({task.comments.length})
            </Typography>
            <Timeline 
             sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0.2,
                },
              }}
            >
              {task.comments.map((comment, index) => {
                const commenter = commentUsers[comment.commented_by] || {
                  name: `User ${comment.commented_by}`,
                  avatar: '/images/avatars/1.png'
                }
                
                return (
                  <TimelineItem key={comment.id}>
                    <TimelineOppositeContent>
                      <Avatar 
                        src={commenter.avatar} 
                        // sx={{ width: 32, height: 32 }}
                      />
                      {index < task.comments.length - 1 && <TimelineConnector />}
                    </TimelineOppositeContent>
                    <TimelineContent>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          mb: 2,
                          bgcolor: 'background.paper',
                          borderRadius: 2
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" fontWeight="medium">
                            {commenter.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatCommentDate(comment.created_at)}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {comment.comment}
                        </Typography>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                )
              })}
            </Timeline>
          </Box>
        )}

        {/* Task Metadata */}
        <Box mt={4}>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="textSecondary">
                Created On: {formatTaskDate(task.created_at)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="textSecondary">
                Last Updated: {formatTaskDate(task.updated_at)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    {/* </Card> */}
    </>
  )
}

export default TaskDetailsView
