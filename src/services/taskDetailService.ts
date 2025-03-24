// Task Details Service
import axiosInstance from '@/libs/axios'

/**
 * Fetch task details by ID
 * @param taskId - The ID of the task to fetch
 * @returns A promise containing the task details
 */
export const getTaskDetails = async (taskId: number): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/web/tasks/${taskId}`)
    const data = response.data
    
    if (data.status && data.data) {
      return data.data
    }
    
    throw new Error(data.message || 'Failed to fetch task details')
  } catch (error) {
    console.error('Error fetching task details:', error)
    throw error
  }
}

/**
 * Format the task creation date to a human-readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatTaskDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Get the color for a priority level
 * @param priority - The task priority (low, medium, high)
 * @returns The corresponding color name
 */
export const getPriorityColor = (priority: string): string => {
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

/**
 * Get a human-readable status label
 * @param status - The task status
 * @returns Formatted status text
 */
export const getStatusLabel = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
