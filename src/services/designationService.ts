import axiosInstance from "@/libs/axios";


export const getDesignations = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/designations', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching Designationes:', error);
    throw error;
  }
};

export const postDesignation = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/designations', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching Designationes:', error);
      throw error;
    }
};

export const updateDesignation = async (id:number, datas:any) => {
  try {
    const response = await axiosInstance.put(`/designations/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteDesignation = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/designations/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Designation:', error);
      throw error;
    }
  };
