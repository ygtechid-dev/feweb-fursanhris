import axiosInstance from "@/libs/axios";


export const getTerminations = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/terminations', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching Terminationes:', error);
    throw error;
  }
};

export const getTerminationType = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/termination-types', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching Terminationes:', error);
    throw error;
  }
};

export const postTermination = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/web/terminations', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching Terminationes:', error);
      throw error;
    }
};

export const updateTermination = async (id:number, datas:any) => {
  try {
    const response = await axiosInstance.put(`/web/terminations/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteTermination = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/web/terminations/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Promotion:', error);
      throw error;
    }
  };
