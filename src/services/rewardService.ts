import axiosInstance from "@/libs/axios";


export const getReward = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/rewards', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching Rewardes:', error);
    throw error;
  }
};

export const getRewardType = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/reward_types', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching Rewardes:', error);
    throw error;
  }
};

export const postReward = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/web/rewards', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching Rewardes:', error);
      throw error;
    }
};

export const updateReward = async (id:number, datas:any) => {
  try {
    const response = await axiosInstance.put(`/web/rewards/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteReward = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/web/rewards/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Reward:', error);
      throw error;
    }
  };
