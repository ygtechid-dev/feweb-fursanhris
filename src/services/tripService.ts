import axiosInstance from "@/libs/axios";


export const getTrip = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/trips', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching Tripes:', error);
    throw error;
  }
};

// export const getTripType = async (params?: {
//   page?: number;
//   per_page?: number;
//   search?: string;
//   // Add other filter parameters as needed
// }): Promise<any> => {
//   try {
//     const response = await axiosInstance.get('/web/Trip_types', { params });
//     return response?.data;
//   } catch (error) {
//     console.error('Error fetching Tripes:', error);
//     throw error;
//   }
// };

export const postTrip = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/web/trips', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching Tripes:', error);
      throw error;
    }
};

export const updateTrip = async (id:number, datas:any) => {
  try {
    const response = await axiosInstance.put(`/web/trips/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteTrip = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/web/trips/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Trip:', error);
      throw error;
    }
  };
