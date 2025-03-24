import axiosInstance from "@/libs/axios";


export const updateTask = async (id:number, taskData:any) => {
  try {
    const response = await axiosInstance.put(`/web/tasks/${id}`, { 
     ...taskData
     });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const updateTaskOrder = async (id:number, taskIds: number[]) => {
  try {
    const response = await axiosInstance.post(`/web/tasks/reorder`, { 
      columnId: id,
      taskIds
     });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Fungsi untuk memperbarui status task saat dipindahkan antar kolom
export const updateTaskStatus = async (taskId: number, newColumnId: number) => {
  // Mapping columnId ke status
  const statusMap: Record<number, string> = {
    1: 'todo',
    2: 'in_progress',
    3: 'in_review',
    4: 'done',
    // Tambahkan mapping lain sesuai kebutuhan
  };

  try {
    const response = await axiosInstance.post(`/web/tasks/${taskId}/status`, { 
      taskId,
      newStatus: statusMap[newColumnId]
     });
    return response?.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    // Mungkin tambahkan notifikasi error disini
  }
};

// Add new function for creating a task
export const createTask = async (taskData: {
  title: string;
  project_id: number;
  status: string;
  priority?: string;
  due_date?: string;
  description?: string;
  assigned?: Array<{id: number}>;
}) => {
  try {
    const response = await axiosInstance.post('/web/tasks', taskData);
    return response?.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTaskApi = async (taskId: number) => {
  try {
    const response = await axiosInstance.delete(`/web/tasks/${taskId}`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Add a comment to a task
export const addTaskComment = async (taskId: number, data: { comment: string }) => {
  try {
    const response = await axiosInstance.post(`/web/tasks/${taskId}/comments`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Delete a task comment
export const deleteTaskComment = async (taskId: number, commentId: number) => {
  try {
    const response = await axiosInstance.delete(`/web/tasks/${taskId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Upload an attachment to a task
export const uploadTaskAttachment = async (taskId: number, formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/web/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
};

// Delete a task attachment
export const deleteTaskAttachment = async (taskId: number, attachmentId: number) => {
  try {
    const response = await axiosInstance.delete(`/web/tasks/${taskId}/attachments/${attachmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting attachment:', error);
    throw error;
  }
};



