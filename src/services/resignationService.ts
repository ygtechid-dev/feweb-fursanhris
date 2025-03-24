import axiosInstance from "@/libs/axios";


export const getResignation = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/resignations', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching Resignationes:', error);
    throw error;
  }
};

// export const getResignationType = async (params?: {
//   page?: number;
//   per_page?: number;
//   search?: string;
//   // Add other filter parameters as needed
// }): Promise<any> => {
//   try {
//     const response = await axiosInstance.get('/web/Resignation_types', { params });
//     return response?.data;
//   } catch (error) {
//     console.error('Error fetching Resignationes:', error);
//     throw error;
//   }
// };

export const postResignation = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/web/resignations', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching Resignationes:', error);
      throw error;
    }
};

export const updateResignation = async (id:number, datas:any) => {
  try {
    const response = await axiosInstance.put(`/web/resignations/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteResignation = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/web/resignations/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Resignation:', error);
      throw error;
    }
  };
