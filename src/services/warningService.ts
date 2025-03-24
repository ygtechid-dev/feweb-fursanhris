import axiosInstance from "@/libs/axios";


export const getWarnings = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/warnings', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching Warninges:', error);
    throw error;
  }
};

// export const getWarningType = async (params?: {
//   page?: number;
//   per_page?: number;
//   search?: string;
//   // Add other filter parameters as needed
// }): Promise<any> => {
//   try {
//     const response = await axiosInstance.get('/web/Warning_types', { params });
//     return response?.data;
//   } catch (error) {
//     console.error('Error fetching Warninges:', error);
//     throw error;
//   }
// };

export const postWarning = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/web/warnings', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching Warninges:', error);
      throw error;
    }
};

export const updateWarning = async (id:number, datas:any) => {
  try {
    const response = await axiosInstance.put(`/web/warnings/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteWarning = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/web/warnings/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Promotion:', error);
      throw error;
    }
  };
