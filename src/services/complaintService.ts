import axiosInstance from "@/libs/axios";


export const getComplaints = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/complaints', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching Complaintes:', error);
    throw error;
  }
};

// export const getComplaintType = async (params?: {
//   page?: number;
//   per_page?: number;
//   search?: string;
//   // Add other filter parameters as needed
// }): Promise<any> => {
//   try {
//     const response = await axiosInstance.get('/web/Complaint_types', { params });
//     return response?.data;
//   } catch (error) {
//     console.error('Error fetching Complaintes:', error);
//     throw error;
//   }
// };

export const postComplaint = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/web/complaints', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching Complaintes:', error);
      throw error;
    }
};

export const updateComplaint = async (id:number, datas:any) => {
  try {
    const response = await axiosInstance.put(`/web/complaints/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteComplaint = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/web/complaints/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Promotion:', error);
      throw error;
    }
  };
