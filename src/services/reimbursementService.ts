import axiosInstance from "@/libs/axios"
import axiosFileInstance from "@/libs/axiosFileInstance";

export const getReimbursementTypes = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/reimbursement-types', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching Reimbursement types:', error);
    throw error;
  }
};

export const getReimbursements = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/reimbursements', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const postReimbursement = async (datas:any): Promise<any> => {
    try {
      const response = await axiosFileInstance.post('/web/reimbursements', datas);
      return response?.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
};

export const updateReimbursement = async (datas:any, id:number): Promise<any> => {
    try {
      // datas.append('_method', 'put');
      const response = await axiosFileInstance.post(`/web/reimbursements/${id}`, datas);
      return response?.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
};

export const deleteReimbursement = async (id: number): Promise<any> => {
  try {
      const response = await axiosInstance.delete(`/web/reimbursements/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting Reimbursements:', error);
    throw error;
  }
};

export const updateReimbursementStatus = async (id:number, datas:any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/web/reimbursements/update-status/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


