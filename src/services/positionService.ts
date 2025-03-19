import axiosInstance from "@/libs/axios";

export const postPosition = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/designations', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching designations:', error);
      throw error;
    }
};

export const updatePosition = async (datas:any, id:number) => {
  try {
    const response = await axiosInstance.put(`/designations/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deletePosition = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/designations/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Position:', error);
      throw error;
    }
  };
