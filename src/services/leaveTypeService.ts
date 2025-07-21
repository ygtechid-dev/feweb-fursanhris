import axiosInstance from "@/libs/axios";


export const getLeaveType = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/leave-types', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching LeaveType:', error);
    throw error;
  }
};

export const postLeaveType = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/leave-types', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching LeaveType:', error);
      throw error;
    }
};

export const updateLeaveType = async (datas:any, id:number) => {
  try {
    const response = await axiosInstance.put(`/leave-types/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteLeaveType = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/leave-types/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting LeaveType:', error);
      throw error;
    }
  };
