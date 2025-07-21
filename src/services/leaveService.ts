import axiosInstance from "@/libs/axios"
import axiosFileInstance from "@/libs/axiosFileInstance";

export const getLeaveTypes = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/leave-types', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching leave types:', error);
    throw error;
  }
};

export const getLeaves = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/leaves', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const postLeave = async (datas:any): Promise<any> => {
    try {
      const response = await axiosFileInstance.post('/web/leaves', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
};

export const updateLeave = async (datas:any, id:number): Promise<any> => {
    try {
      const response = await axiosInstance.put(`/web/leaves/${id}`, { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
};

export const deleteLeave = async (id: number): Promise<any> => {
  try {
      const response = await axiosInstance.delete(`/web/leaves/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting leaves:', error);
    throw error;
  }
};

export const updateLeaveStatus = async (id:number, datas:any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/web/leaves/update-status/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


