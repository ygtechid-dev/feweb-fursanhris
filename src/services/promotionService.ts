import axiosInstance from "@/libs/axios";


export const getPromotion = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/promotions', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching Promotiones:', error);
    throw error;
  }
};

// export const getPromotionType = async (params?: {
//   page?: number;
//   per_page?: number;
//   search?: string;
//   // Add other filter parameters as needed
// }): Promise<any> => {
//   try {
//     const response = await axiosInstance.get('/web/Promotion_types', { params });
//     return response?.data;
//   } catch (error) {
//     console.error('Error fetching Promotiones:', error);
//     throw error;
//   }
// };

export const postPromotion = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/web/promotions', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching Promotiones:', error);
      throw error;
    }
};

export const updatePromotion = async (id:number, datas:any) => {
  try {
    const response = await axiosInstance.put(`/web/promotions/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deletePromotion = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/web/promotions/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Promotion:', error);
      throw error;
    }
  };
