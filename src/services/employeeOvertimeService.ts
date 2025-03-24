import axiosInstance from "@/libs/axios";


export const postOvertime = async (id:number, datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post(`/web/employees/${id}/overtimes`, { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching Overtime:', error);
      throw error;
    }
};

export const updateOvertime = async (id:number, OvertimeId:number, datas:any) => {
  try {
    const response = await axiosInstance.put(`/web/employees/${id}/overtimes/${OvertimeId}`, { ...datas });
    return response?.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const deleteOvertime = async (id: number, OvertimeId:number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/web/employees/${id}/overtimes/${OvertimeId}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting Deduction:', error);
      throw error;
    }
  };
