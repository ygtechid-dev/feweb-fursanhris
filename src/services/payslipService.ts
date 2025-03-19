import axiosInstance from "@/libs/axios"

export const getPayslips = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/payslips', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching payslips:', error);
    throw error;
  }
};

// export const postOvertime = async (datas:any): Promise<any> => {
//     try {
//       const response = await axiosInstance.post('/web/overtimes', { ...datas });
//       return response?.data;
//     } catch (error) {
//       console.error('Error:', error);
//       throw error;
//     }
// };

// export const updateOvertime = async (datas:any, id:number): Promise<any> => {
//     try {
//       const response = await axiosInstance.put(`/web/overtimes/${id}`, { ...datas });
//       return response?.data;
//     } catch (error) {
//       console.error('Error:', error);
//       throw error;
//     }
// };

export const deletePayslips = async (id: number): Promise<any> => {
  try {
      const response = await axiosInstance.delete(`/web/payslips/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting payslips:', error);
    throw error;
  }
};

export const updatePayslipPaymentStatus = async (id:number, datas:any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/web/payslips/update-payment-status/${id}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


