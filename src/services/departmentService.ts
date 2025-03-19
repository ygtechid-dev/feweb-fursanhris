import axiosInstance from "@/libs/axios";

export const getDepartments = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/departments', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const postDepartment = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/departments', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
};

export const updateDepartment = async (datas:any, id:number) => {
  try {
    const response = await axiosInstance.put(`/departments/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteDepartment = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/departments/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Department:', error);
      throw error;
    }
  };
