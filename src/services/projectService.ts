import axiosInstance from "@/libs/axios";


export const getProjects = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/projects', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching Projectes:', error);
    throw error;
  }
};

export const postProject = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/web/projects', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching Projectes:', error);
      throw error;
    }
};

export const updateProject = async (id:number, datas:any) => {
  try {
    const response = await axiosInstance.put(`/web/projects/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteProject = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/web/projects/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Promotion:', error);
      throw error;
    }
  };
