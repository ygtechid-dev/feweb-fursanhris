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

export const getOvertimes = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/overtimes', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const postOvertime = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/web/overtimes', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
};

export const updateOvertime = async (datas:any, id:number): Promise<any> => {
    try {
      const response = await axiosInstance.put(`/web/overtimes/${id}`, { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
};

export const deleteOvertime = async (id: number): Promise<any> => {
  try {
      const response = await axiosInstance.delete(`/web/overtimes/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting overtimes:', error);
    throw error;
  }
};

export const updateOvertimestatus = async (id:number, datas:any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/web/overtimes/update-status/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


