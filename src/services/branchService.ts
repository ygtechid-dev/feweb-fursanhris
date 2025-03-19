import axiosInstance from "@/libs/axios";


export const getBranches = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/branches', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const postBranch = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/branches', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
};

export const updateBranch = async (datas:any, id:number) => {
  try {
    const response = await axiosInstance.put(`/branches/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteBranch = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/branches/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  };
