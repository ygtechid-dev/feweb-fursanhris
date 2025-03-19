import axiosInstance from "@/libs/axios";


// export const getEmployeeAllowances = async (params?: {
//   page?: number;
//   per_page?: number;
//   search?: string;
//   // Add other filter parameters as needed
// }): Promise<any> => {
//   try {
//     const response = await axiosInstance.get('/web/employees/{id}/allowances/{allowanceId}', { params });
//     return response?.data;
//   } catch (error) {
//     console.error('Error fetching branches:', error);
//     throw error;
//   }
// };

export const postAllowance = async (id:number, datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post(`/web/employees/${id}/allowances`, { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching Allowance:', error);
      throw error;
    }
};

export const updateAllowance = async (id:number, allowanceId:number, datas:any) => {
  try {
    const response = await axiosInstance.put(`/web/employees/${id}/allowances/${allowanceId}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteAllowance = async (id: number, allowanceId:number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/web/employees/${id}/allowances/${allowanceId}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Allowance:', error);
      throw error;
    }
  };
