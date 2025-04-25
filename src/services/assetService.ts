import axiosInstance from "@/libs/axios"

// export const getLeaveTypes = async (params?: {
//   page?: number;
//   per_page?: number;
//   search?: string;
//   // Add other filter parameters as needed
// }): Promise<any> => {
//   try {
//     const response = await axiosInstance.get('/leave-types', { params });
//     return response?.data;
//   } catch (error) {
//     console.error('Error fetching leave types:', error);
//     throw error;
//   }
// };

export const getAssets = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/assets', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const postAsset = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/web/assets', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
};

export const updateAsset = async (datas:any, id:number): Promise<any> => {
    try {
      const response = await axiosInstance.put(`/web/assets/${id}`, { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
};

export const deleteAsset = async (id: number): Promise<any> => {
  try {
      const response = await axiosInstance.delete(`/web/assets/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting Assets:', error);
    throw error;
  }
};

export const updateAssetstatus = async (id:number, datas:any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/web/assets/update-status/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


