import axiosInstance from "@/libs/axios";


export const postDeduction = async (id:number, datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post(`/web/employees/${id}/deductions`, { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching Deduction:', error);
      throw error;
    }
};

export const updateDeduction = async (id:number, deductionId:number, datas:any) => {
  try {
    const response = await axiosInstance.put(`/web/employees/${id}/deductions/${deductionId}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteDeduction = async (id: number, deductionId:number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/web/employees/${id}/deductions/${deductionId}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Deduction:', error);
      throw error;
    }
  };
